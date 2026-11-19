// The shape of the generated compound data in public/data/ (written by
// scripts/fetchCompounds.mjs, or rebuildFromAiida.mjs): what the dashboard and the details page read.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const DATA = new URL("../public/data/", import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, DATA)));
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const numberOrNull = (v) => v === null || (typeof v === "number" && Number.isFinite(v));

const { compounds, table_data: tableData } = read("compounds.json").data;

test("compounds.json: names and table rows", () => {
  assert.ok(compounds.length > 0);
  assert.equal(new Set(compounds).size, compounds.length);
  const names = new Set(compounds);
  for (const row of tableData) {
    assert.equal(row.length, 8);
    assert.ok(names.has(row[0]), row[0]);
    assert.ok(["Isolated", "Entangled"].includes(row[1]));
    assert.ok(row.slice(2).every(numberOrNull), row.join());
  }
  assert.ok(compounds.every((c) => tableData.some((r) => r[0] === c)));
});

test("compounds/<name>.json: one per compound, uuids and numbers", () => {
  const MANIFOLDS = { valence_only: "Isolated", with_conduction: "Entangled" };
  for (const name of compounds) {
    const file = read(`compounds/${encodeURIComponent(name)}.json`).data;
    assert.deepEqual(Object.keys(file), [name]);
    const { structure_uuid, fermi_energy, bands } = file[name];
    assert.match(structure_uuid, UUID, name);
    assert.ok(numberOrNull(fermi_energy), name);
    assert.match(bands.DFT_uuid, UUID, name);
    const manifolds = Object.keys(bands.Wannier);
    assert.ok(manifolds.length > 0 && manifolds.every((m) => m in MANIFOLDS), name);
    for (const [manifold, methods] of Object.entries(bands.Wannier)) {
      for (const [method, meshes] of Object.entries(methods)) {
        assert.ok(["SCDM_only", "SCDM+MLWF", "random+MLWF"].includes(method), `${name} ${method}`);
        for (const [mesh, v] of Object.entries(meshes)) {
          assert.ok(Number(mesh) > 0, `${name} ${mesh}`);
          assert.match(v.bands_node_uuid, UUID);
          assert.ok([v.eta, v.eta_max].every(numberOrNull));
          assert.equal(typeof v.total_spread, "number");
        }
      }
      // the table row of this manifold has the values at 0.2
      const row = tableData.find((r) => r[0] === name && r[1] === MANIFOLDS[manifold]);
      assert.ok(row, `${name} ${manifold}`);
      assert.equal(row[4], methods.SCDM_only?.["0.2"]?.total_spread ?? null);
      assert.equal(row[7], methods["SCDM+MLWF"]?.["0.2"]?.total_spread ?? null);
    }
  }
});
