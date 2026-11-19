// The data transformations of the old controllers (structureselection.js,
// structuredetails.js, the periodicTable directive), as pure functions.
// No React here, so tests/ can import it with plain node.

/** "with_conduction"/"valence_only" as the pages call them */
export const MANIFOLDS = [
  { key: "valence_only", label: "Isolated" },
  { key: "with_conduction", label: "Entangled" },
];

/** the Wannierisation methods, in the order of the tabs */
export const METHODS = [
  { key: "SCDM_only", label: "SCDM only" },
  { key: "SCDM+MLWF", label: "SCDM+MLWF" },
  { key: "random+MLWF", label: "random+MLWF" },
];

/** the suggested linear k-point spacing (1/Å): the values shown everywhere but the band tabs */
export const KPOINT_MESH = "0.2";

/** the three quality measures of a Wannierisation; eta in eV, spread in Å² */
export const METRICS = [
  { key: "eta", multiplier: 1000, digits: 1 },
  { key: "eta_max", multiplier: 1000, digits: 1 },
  { key: "total_spread", multiplier: 1, digits: 2 },
];

/** parseFloat((value * multiplier).toFixed(digits)), "N/A" when missing (as the old pages) */
export function scaled(value, multiplier, digits) {
  if (value === undefined || value === null) return "N/A";
  return Number.parseFloat((value * multiplier).toFixed(digits));
}

/** "Si2O4-1" -> { formula: "Si2O4", suffix: "1" }; compound names may carry a "-suffix" */
export function splitName(compound) {
  const i = compound.indexOf("-");
  return i > 0 ? { formula: compound.slice(0, i), suffix: compound.slice(i + 1) } : { formula: compound, suffix: "" };
}

/** the elements of a compound name, without repetitions */
export function elementsOf(compound) {
  return [...new Set(splitName(compound).formula.match(/[A-Z][a-z]?/g) ?? [])];
}

/** the compounds that contain all the selected elements */
export function withElements(compounds, selected) {
  return compounds.filter((c) => {
    const elements = elementsOf(c);
    return selected.every((e) => elements.includes(e));
  });
}

/** the elements of a list of compounds */
export function elementsOfAll(compounds) {
  return [...new Set(compounds.flatMap(elementsOf))];
}

// table_data rows of the compounds list:
// [compound, manifold ("Isolated"|"Entangled"),
//  SCDM-only eta, eta_max, total_spread, SCDM+MLWF eta, eta_max, total_spread]

/** the rows of the list view (eta in meV) */
export function tableRows(tableData) {
  return tableData.map((r) => ({
    compound: r[0],
    manifold: r[1],
    scdmOnly: [scaled(r[2], 1000, 1), scaled(r[3], 1000, 1), scaled(r[4], 1, 2)],
    scdmMlwf: [scaled(r[5], 1000, 1), scaled(r[6], 1000, 1), scaled(r[7], 1, 2)],
  }));
}

/**
 * The points of the plot view, one series per manifold: the relative change
 * in total spread 100 (Ω_SCDM - Ω_MLWF) / Ω_MLWF (%) and the change in bands
 * distance (η_MLWF - η_SCDM) (meV) before and after the MLWF step.
 */
export function scatterSeries(tableData) {
  const missing = (...values) => values.some((v) => v === null || v === undefined);
  return ["Isolated", "Entangled"].map((manifold) => {
    const rows = tableData.filter((r) => r[1] === manifold);
    return {
      manifold,
      compounds: rows.map((r) => r[0]),
      // null (no point) when a value is missing
      x: rows.map((r) => (missing(r[4], r[7]) ? null : (100 * (r[4] - r[7])) / r[7])),
      y: rows.map((r) => (missing(r[2], r[5]) ? null : (r[5] - r[2]) * 1000)),
      // eta, eta_max (meV), total spread (Å²) of SCDM+MLWF, for the hover text
      mlwf: rows.map((r) => [scaled(r[5], 1000, 2), scaled(r[6], 1000, 2), scaled(r[7], 1, 2)]),
    };
  });
}

// Compound details: bands.Wannier[manifold][method][mesh] =
//   { bands_node_uuid, eta, eta_max, total_spread }

/**
 * The "Info and properties" panel: for each manifold present, its methods
 * (in METHODS order) with the band node and the metrics at KPOINT_MESH.
 */
export function propertiesSummary(details) {
  const wannier = details.bands?.Wannier ?? {};
  return MANIFOLDS.filter((m) => wannier[m.key]).map((m) => ({
    ...m,
    methods: METHODS.filter((method) => wannier[m.key][method.key]).map((method) => {
      const values = wannier[m.key][method.key][KPOINT_MESH] ?? {};
      return {
        ...method,
        uuid: values.bands_node_uuid,
        metrics: METRICS.map((metric) => scaled(values[metric.key], metric.multiplier, metric.digits)),
      };
    }),
  }));
}

/**
 * The band tabs of a manifold: the methods present, each with its k-point
 * meshes in the order of the data; the method shown first is SCDM+MLWF and the
 * mesh KPOINT_MESH, when present.
 */
export function bandTabs(manifoldData) {
  const methods = METHODS.filter((m) => manifoldData[m.key]).map((m) => {
    const meshes = Object.entries(manifoldData[m.key]).map(([mesh, values]) => ({ mesh, ...values }));
    const preferred = meshes.findIndex((x) => x.mesh === KPOINT_MESH);
    return { ...m, meshes, defaultMesh: preferred >= 0 ? preferred : 0 };
  });
  const preferred = methods.findIndex((m) => m.key === "SCDM+MLWF");
  return { methods, defaultMethod: preferred >= 0 ? preferred : 0 };
}

/**
 * The energy range of a band plot: the extent of the (Wannier) bands from the
 * Fermi energy, rounded, plus 1 eV on each side.
 */
/** AiiDA bands ({ path, paths: [{ x, values: [band][k] }] }) with the energies measured from the Fermi energy */
export const fromFermi = (bands, fermiEnergy) => ({
  ...bands,
  paths: bands.paths.map((p) => ({ ...p, values: p.values.map((band) => band.map((e) => e - fermiEnergy)) })),
});
