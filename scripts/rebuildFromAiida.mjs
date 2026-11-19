#!/usr/bin/env node
// FALLBACK: scripts/fetchCompounds.mjs downloads the original summaries from
// the legacy API; use this only if that is gone. eta and eta_max are not in
// the AiiDA database and come out null.
// Rebuilds the compound summaries (public/data/compounds.json and
// public/data/compounds/<name>.json, in the format of the old Materials Cloud
// discover backend, /mcloud/api/v2/discover/scdm/compounds[/<name>]) from the
// AiiDA REST API v4 of the autowannier profile. GET requests only.
//
//   node scripts/rebuildFromAiida.mjs          (AIIDA_CACHE=<dir> to choose the cache)
//
// Raw responses are cached on disk (default: <tmpdir>/autowannier-aiida-cache),
// so a rerun downloads nothing; delete the cache to refetch. About 3000
// requests on a cold cache, at most 4 in flight.
//
// THE GRAPH WALK
//
// Neither group membership (groups/ only lists the 20 groups
// AutoWannier-<manifold>-<method>-<mesh>, not their nodes), extras, labels nor
// process types help: the nodes are found by type and process_label.
//
//  1. nodes/page/N/?node_type="process.workflow.workchain.WorkChainNode."
//     (attribute process_label): 2572 Wannier90WorkChain, one per compound,
//     band manifold, method and k-point spacing, and 212
//     CustomPwBandStructureWorkChain (relax + DFT bands; 200 compounds, a few
//     reruns).
//  2. nodes/page/N/?node_type="data.core.dict.Dict." with a few attributes:
//     every Dict's group_name, Omega_I/D/OD, fermi_energy, num_iter,
//     scdm_proj (one sweep instead of one request per Dict).
//  3. nodes/<wannier workchain>/links/tree/ (incoming + outgoing in one call):
//       in  "structure"              StructureData; its description is the
//                                    formula (AiiDA get_formula, hill_compact)
//       in  "workchain_control"      Dict; group_name, the name of the run's
//                                    original group, e.g.
//                                    W90_wc_insulators_onlyvalence_mlwf_random_0.3_500_SCDM_auto
//                                    -> manifold, method, k-point spacing (below)
//       in  "mlwf_parameters"        Dict; num_iter, scdm_proj (cross-check of
//                                    the method)
//       out "MLWF_interpolated_bands" BandsData -> bands_node_uuid
//       out "mlwf_output_parameters" Dict (wannier90 output) -> total_spread =
//                                    Omega_I + Omega_D + Omega_OD (Å², the sum
//                                    of the spreads of all Wannier functions)
//  4. nodes/<CustomPwBandStructureWorkChain>/links/tree/:
//       out "primitive_structure"    the StructureData the Wannier workchains
//                                    take as input -> structure_uuid
//       out "band_structure"         BandsData -> bands.DFT_uuid
//       out "scf_parameters"         Dict (pw.x scf output) -> fermi_energy (eV)
//
// group_name -> keys of the old format:
//   withconduction -> with_conduction ("Entangled"),
//   insulators_onlyvalence -> valence_only ("Isolated");
//   _mlwf_random_ -> random+MLWF, _mlwf_ -> SCDM+MLWF, otherwise SCDM_only;
//   the number before _500_ is the k-point spacing (1/Å); without one, 0.2
//   (the groups W90_wc_withconduction_500_SCDM_auto and
//   W90_wc_insulators_onlyvalence_500_SCDM_auto are the SCDM-only 0.2 runs).
//
// NOT IN THE DATABASE: the band distances eta and eta_max. No node holds them
// (no Dict/Float/attribute/label; they were computed outside AiiDA for the
// paper and only the gone discover backend had them), and they cannot be
// recomputed exactly from the stored bands (the DFT and Wannier band
// structures are on different k-point paths). They are null in the output.
//
// Compound names: the formula of the structure; if two compounds have the same
// formula, "-1", "-2", ... in the order of their structure uuids, after
// merging same-formula structures whose runs are complementary (F2Xe, RuS2:
// runs split over two relaxations) (the old
// backend's names for these are unknown).
//
// compounds.json table_data: one row per compound and band manifold,
//   [name, "Isolated"|"Entangled",
//    SCDM_only eta, eta_max, total_spread, SCDM+MLWF eta, eta_max, total_spread]
// at the k-point spacing 0.2, as the old list and plot views read it.

import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const API = "https://aiida.materialscloud.org/autowannier/api/v4/";
const CACHE = process.env.AIIDA_CACHE ?? join(tmpdir(), "autowannier-aiida-cache");
const OUT = new URL("../public/data/", import.meta.url);
const PERPAGE = 400; // the API's maximum
const MESH = "0.2";
const MANIFOLD_LABEL = { valence_only: "Isolated", with_conduction: "Entangled" };

let requests = 0;

// ---- cached, polite GET ----------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(path) {
  const file = join(CACHE, `${createHash("sha256").update(path).digest("hex").slice(0, 32)}.json`);
  try {
    return JSON.parse(await readFile(file, "utf8")).data;
  } catch {
    // not cached
  }
  for (let attempt = 0; ; attempt++) {
    requests++;
    let error;
    try {
      const response = await fetch(API + path);
      if (response.ok) {
        const text = await response.text();
        const json = JSON.parse(text);
        await writeFile(file, text);
        return json.data;
      }
      error = new Error(`${response.status} ${response.statusText} (${path})`);
    } catch (e) {
      error = e;
    }
    if (attempt === 5) throw error;
    await sleep(1000 * 2 ** attempt);
  }
}

/** map with at most `limit` promises in flight */
async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  let done = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
      if (++done % 250 === 0) console.error(`  ${done}/${items.length}`);
    }
  };
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

/** all nodes of a type, with the given attributes (null when missing) */
async function nodesOfType(nodeType, attributes, count) {
  const query = `perpage=${PERPAGE}&node_type="${nodeType}"&attributes=true&attributes_filter=${attributes.join(",")}`;
  const pages = Array.from({ length: Math.ceil(count / PERPAGE) }, (_, i) => i + 1);
  const nodes = (await pool(pages, 4, async (p) => (await get(`nodes/page/${p}/?${query}`)).nodes)).flat();
  if (nodes.length !== count) throw new Error(`${nodeType}: ${nodes.length} nodes, expected ${count}`);
  return nodes;
}

/** incoming and outgoing links of a node, by link label */
async function tree(uuid) {
  const data = await get(`nodes/${uuid}/links/tree/`);
  const meta = data.metadata[0];
  if (meta.sent_no_of_incomings !== meta.total_no_of_incomings || meta.sent_no_of_outgoings !== meta.total_no_of_outgoings)
    throw new Error(`links/tree of ${uuid} is truncated`);
  const byLabel = (links) => Object.fromEntries(links.map((l) => [l.link_label, l]));
  return { incoming: byLabel(data.nodes[0].incoming), outgoing: byLabel(data.nodes[0].outgoing) };
}

// ---- the walk --------------------------------------------------------------

/** "W90_wc_insulators_onlyvalence_mlwf_random_0.3_500_SCDM_auto" -> run keys */
function parseGroupName(name) {
  const m = /^W90_wc_(withconduction|insulators_onlyvalence)(_mlwf_random|_mlwf)?(?:_([\d.]+))?_500_SCDM_auto$/.exec(name);
  if (!m) throw new Error(`unknown group_name ${name}`);
  return {
    manifold: m[1] === "withconduction" ? "with_conduction" : "valence_only",
    method: m[2] === "_mlwf_random" ? "random+MLWF" : m[2] === "_mlwf" ? "SCDM+MLWF" : "SCDM_only",
    mesh: m[3] ?? MESH,
  };
}

async function main() {
  await mkdir(CACHE, { recursive: true });
  const stats = await get("nodes/statistics/");
  const count = (type) => stats.types[type] ?? 0;

  console.error("workchains...");
  const workchains = await nodesOfType(
    "process.workflow.workchain.WorkChainNode.",
    ["process_label"],
    count("process.workflow.workchain.WorkChainNode."),
  );
  const wannierChains = workchains.filter((n) => n.attributes.process_label === "Wannier90WorkChain").map((n) => n.uuid);
  const dftChains = workchains
    .filter((n) => n.attributes.process_label === "CustomPwBandStructureWorkChain")
    .map((n) => n.uuid);

  console.error("dicts...");
  const dictAttributes = ["group_name", "Omega_I", "Omega_D", "Omega_OD", "fermi_energy", "num_iter", "scdm_proj"];
  const dicts = new Map(
    (await nodesOfType("data.core.dict.Dict.", dictAttributes, count("data.core.dict.Dict."))).map((n) => [
      n.uuid,
      n.attributes,
    ]),
  );

  console.error(`${dftChains.length} CustomPwBandStructureWorkChain...`);
  const dft = new Map(); // primitive structure uuid -> { DFT_uuid, fermi_energy }
  for (const t of await pool(dftChains, 4, tree)) {
    const { primitive_structure: s, band_structure: b, scf_parameters: p } = t.outgoing;
    if (!s || !b) continue; // not finished
    dft.set(s.uuid, { DFT_uuid: b.uuid, fermi_energy: p ? (dicts.get(p.uuid)?.fermi_energy ?? null) : null });
  }

  console.error(`${wannierChains.length} Wannier90WorkChain...`);
  const compounds = new Map(); // structure uuid -> { formula, wannier }
  const problems = [];
  for (const [uuid, t] of (await pool(wannierChains, 4, tree)).map((t, i) => [wannierChains[i], t])) {
    const structure = t.incoming.structure;
    const control = dicts.get(t.incoming.workchain_control?.uuid);
    const bands = t.outgoing.MLWF_interpolated_bands;
    const output = dicts.get(t.outgoing.mlwf_output_parameters?.uuid);
    if (!structure || !control?.group_name || !bands || !output) {
      problems.push(`${uuid}: incomplete workchain, skipped`);
      continue;
    }
    const { manifold, method, mesh } = parseGroupName(control.group_name);

    // cross-check the method against the wannier90 input parameters
    const params = dicts.get(t.incoming.mlwf_parameters?.uuid) ?? {};
    const expected = { SCDM_only: [true, false], "SCDM+MLWF": [true, true], "random+MLWF": [false, true] }[method];
    if (Boolean(params.scdm_proj) !== expected[0] || params.num_iter > 0 !== expected[1])
      problems.push(`${uuid}: ${control.group_name} but scdm_proj=${params.scdm_proj} num_iter=${params.num_iter}`);

    if (!compounds.has(structure.uuid)) compounds.set(structure.uuid, { formula: structure.description, wannier: {} });
    const w = compounds.get(structure.uuid).wannier;
    ((w[manifold] ??= {})[method] ??= {});
    if (w[manifold][method][mesh]) problems.push(`${uuid}: duplicate ${structure.uuid} ${control.group_name}`);
    w[manifold][method][mesh] = {
      bands_node_uuid: bands.uuid,
      eta: null, // not in the database
      eta_max: null, // not in the database
      total_spread: output.Omega_I + output.Omega_D + output.Omega_OD,
    };
  }

  // Structures with the same formula whose runs do not overlap are one
  // compound whose runs were split over two relaxations (reruns): merge them,
  // keeping the structure (and DFT bands) of the run shown first
  // (with_conduction SCDM+MLWF 0.2), else of the most runs.
  const runs = (s) => {
    const w = compounds.get(s).wannier;
    return Object.keys(w).flatMap((m) => Object.keys(w[m]).flatMap((k) => Object.keys(w[m][k]).map((x) => `${m} ${k} ${x}`)));
  };
  const byFormula = Map.groupBy([...compounds.keys()].sort(), (s) => compounds.get(s).formula);
  for (const [formula, structures] of byFormula) {
    const all = structures.flatMap(runs);
    if (structures.length < 2 || new Set(all).size !== all.length) continue;
    const main =
      structures.find((s) => compounds.get(s).wannier.with_conduction?.["SCDM+MLWF"]?.[MESH]) ??
      structures.toSorted((a, b) => runs(b).length - runs(a).length)[0];
    const merged = compounds.get(main).wannier;
    for (const s of structures.filter((x) => x !== main)) {
      for (const [m, methods] of Object.entries(compounds.get(s).wannier))
        for (const [k, meshes] of Object.entries(methods)) Object.assign(((merged[m] ??= {})[k] ??= {}), meshes);
      compounds.delete(s);
      problems.push(`${formula}: runs of structure ${s} merged into ${main} (DFT bands/Fermi energy of the latter)`);
    }
    byFormula.set(formula, [main]);
  }

  // names: the formula, "-1", "-2"... for formulas shared by several structures
  const named = [];
  for (const [formula, structures] of byFormula)
    structures.forEach((s, i) => named.push([structures.length > 1 ? `${formula}-${i + 1}` : formula, s]));
  named.sort(([a], [b]) => a.localeCompare(b));

  // ---- write ----
  const dir = new URL("compounds/", OUT);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  const tableData = [];
  for (const [name, structure] of named) {
    const { wannier } = compounds.get(structure);
    const d = dft.get(structure);
    if (!d) problems.push(`${name}: no DFT band structure for structure ${structure}`);
    // sort the meshes numerically, the manifolds and methods as the old pages
    const sorted = Object.fromEntries(
      Object.keys(MANIFOLD_LABEL)
        .filter((m) => wannier[m])
        .map((m) => [
          m,
          Object.fromEntries(
            ["SCDM_only", "SCDM+MLWF", "random+MLWF"]
              .filter((k) => wannier[m][k])
              .map((k) => [
                k,
                Object.fromEntries(Object.entries(wannier[m][k]).sort(([a], [b]) => Number(a) - Number(b))),
              ]),
          ),
        ]),
    );
    const details = {
      structure_uuid: structure,
      fermi_energy: d?.fermi_energy ?? null,
      bands: { DFT_uuid: d?.DFT_uuid ?? null, Wannier: sorted },
    };
    await writeFile(new URL(`${encodeURIComponent(name)}.json`, dir), `${JSON.stringify({ data: { [name]: details } })}\n`);
    for (const [manifold, methods] of Object.entries(sorted)) {
      const at = (k) => methods[k]?.[MESH] ?? {};
      const metrics = (k) => [at(k).eta ?? null, at(k).eta_max ?? null, at(k).total_spread ?? null];
      tableData.push([name, MANIFOLD_LABEL[manifold], ...metrics("SCDM_only"), ...metrics("SCDM+MLWF")]);
    }
  }
  await writeFile(
    new URL("compounds.json", OUT),
    `${JSON.stringify({ data: { compounds: named.map(([n]) => n), table_data: tableData } })}\n`,
  );

  for (const p of problems) console.error(`warning: ${p}`);
  console.error(
    `${named.length} compounds, ${tableData.length} table rows, ${wannierChains.length} Wannier90WorkChain; ${requests} requests (cache: ${CACHE})`,
  );
}

await main();
