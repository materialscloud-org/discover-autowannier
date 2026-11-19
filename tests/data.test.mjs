// The data transformations of src/Autowannier/data.js against the old
// controllers' behaviour. The compound rows below only have the SHAPE of the
// old discover backend's responses (the values are made up); the bands are a
// real BandsData node of the AiiDA REST API (derived_properties).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  bandTabs,
  elementsOf,
  elementsOfAll,
  fromFermi,
  sortTable,
  propertiesSummary,
  scaled,
  scatterSeries,
  splitName,
  tableRows,
  withElements,
} from "../src/Autowannier/data.js";

const bands = JSON.parse(readFileSync(new URL("fixtures/bands-f3618213.json", import.meta.url)));

// [compound, manifold, SCDM-only eta, eta_max, spread, SCDM+MLWF eta, eta_max, spread]
const TABLE = [
  ["GaAs", "Isolated", 0.002, 0.01, 12.5, 0.001, 0.004, 10],
  ["Si2O4-1", "Entangled", 0.0031, 0.02, 30, 0.0052, 0.03, 25],
];

test("compound names: formula, suffix and elements", () => {
  assert.deepEqual(splitName("Si2O4-1"), { formula: "Si2O4", suffix: "1" });
  assert.deepEqual(splitName("GaAs"), { formula: "GaAs", suffix: "" });
  assert.deepEqual(elementsOf("Si2O4-1"), ["Si", "O"]);
  assert.deepEqual(elementsOf("CsCl"), ["Cs", "Cl"]);
  assert.deepEqual(elementsOfAll(["GaAs", "AlAs", "Si2O4-1"]), ["Ga", "As", "Al", "Si", "O"]);
});

test("periodic table selection: compounds with all selected elements", () => {
  const compounds = ["GaAs", "AlAs", "CsCl", "C", "Cs2O"];
  assert.deepEqual(withElements(compounds, []), compounds);
  assert.deepEqual(withElements(compounds, ["As"]), ["GaAs", "AlAs"]);
  assert.deepEqual(withElements(compounds, ["As", "Ga"]), ["GaAs"]);
  // C is not Cs or Cl (the old regex "C\d*(?![a-z])")
  assert.deepEqual(withElements(compounds, ["C"]), ["C"]);
  assert.deepEqual(withElements(compounds, ["Cs"]), ["CsCl", "Cs2O"]);
});

test("scaled values as parseFloat(toFixed), N/A when missing", () => {
  assert.equal(scaled(0.00123, 1000, 1), 1.2);
  assert.equal(scaled(12.3456, 1, 2), 12.35);
  assert.equal(scaled(undefined, 1000, 1), "N/A");
});

test("list rows: eta in meV with 1 digit, spread with 2", () => {
  assert.deepEqual(tableRows(TABLE)[1], {
    compound: "Si2O4-1",
    manifold: "Entangled",
    scdmOnly: [3.1, 20, 30],
    scdmMlwf: [5.2, 30, 25],
  });
});

test("plot points: relative change in spread (%) and change in eta (meV)", () => {
  const [isolated, entangled] = scatterSeries(TABLE);
  assert.equal(isolated.manifold, "Isolated");
  assert.deepEqual(isolated.compounds, ["GaAs"]);
  assert.equal(isolated.x[0], 25); // 100 (12.5 - 10) / 10
  assert.ok(Math.abs(isolated.y[0] - -1) < 1e-12); // (0.001 - 0.002) * 1000
  assert.deepEqual(entangled.compounds, ["Si2O4-1"]);
  assert.equal(entangled.x[0], 20);
  assert.deepEqual(entangled.mlwf[0], [5.2, 30, 25]);
});

test("plot points: no point when eta is missing", () => {
  const [isolated] = scatterSeries([["GaAs", "Isolated", null, null, 12.5, null, null, 10]]);
  assert.deepEqual([isolated.x, isolated.y, isolated.mlwf], [[25], [null], [["N/A", "N/A", 10]]]);
});

const DETAILS = {
  structure_uuid: "s",
  fermi_energy: 5,
  bands: {
    DFT_uuid: "dft",
    Wannier: {
      with_conduction: {
        "SCDM+MLWF": { "0.2": { bands_node_uuid: "w1", eta: 0.001, eta_max: 0.002, total_spread: 3.14159 } },
      },
      valence_only: {
        "random+MLWF": { "0.15": { bands_node_uuid: "r15" }, "0.2": { bands_node_uuid: "r2", eta: 0.0004 } },
        SCDM_only: { "0.3": { bands_node_uuid: "s3" } },
      },
    },
  },
};

test("properties panel: manifolds and methods in the old order, values at 0.2", () => {
  const summary = propertiesSummary(DETAILS);
  assert.deepEqual(
    summary.map((m) => m.label),
    ["Isolated", "Entangled"],
  );
  assert.deepEqual(
    summary[0].methods.map((m) => [m.label, m.uuid, m.metrics]),
    [
      ["SCDM only", undefined, ["N/A", "N/A", "N/A"]],
      ["random+MLWF", "r2", [0.4, "N/A", "N/A"]],
    ],
  );
  assert.deepEqual(summary[1].methods[0].metrics, [1, 2, 3.14]);
});

test("band tabs: SCDM+MLWF and 0.2 first when present", () => {
  const entangled = bandTabs(DETAILS.bands.Wannier.with_conduction);
  assert.equal(entangled.methods[entangled.defaultMethod].key, "SCDM+MLWF");
  const isolated = bandTabs(DETAILS.bands.Wannier.valence_only);
  assert.deepEqual(
    isolated.methods.map((m) => [m.key, m.meshes.map((x) => x.mesh), m.defaultMesh]),
    [
      ["SCDM_only", ["0.3"], 0],
      ["random+MLWF", ["0.15", "0.2"], 1],
    ],
  );
  assert.equal(isolated.defaultMethod, 0); // no SCDM+MLWF: the first method
});

test("fromFermi: energies from the Fermi energy, everything else kept", () => {
  const small = { path: [["G", "X"]], paths: [{ x: [0, 1], values: [[-1, 0.5], [2, 3]], two_band_types: false }] };
  const shifted = fromFermi(small, 0.5);
  assert.deepEqual(shifted.paths[0].values, [[-1.5, 0], [1.5, 2.5]]);
  assert.deepEqual(shifted.paths[0].x, [0, 1]);
  assert.equal(shifted.paths[0].two_band_types, false);
  assert.deepEqual(shifted.path, small.path);
  assert.deepEqual(small.paths[0].values, [[-1, 0.5], [2, 3]]); // input unchanged

  // a real band structure of the API keeps its shape, every energy shifted
  const real = fromFermi(bands, 5);
  assert.equal(real.paths.length, bands.paths.length);
  real.paths.forEach((p, i) =>
    p.values.forEach((band, b) => band.forEach((e, k) => assert.equal(e, bands.paths[i].values[b][k] - 5))),
  );
});

test("sortTable: numbers and text, both directions, missing values last", () => {
  const t = [
    ["B", "Entangled", 2, 0, 0, 0, 0, 0],
    ["a", "Isolated", null, 0, 0, 0, 0, 0],
    ["C", "Entangled", 1, 0, 0, 0, 0, 0],
  ];
  const names = (rows) => rows.map((r) => r[0]);
  assert.deepEqual(names(sortTable(t, 2)), ["C", "B", "a"]);
  assert.deepEqual(names(sortTable(t, 2, false)), ["B", "C", "a"]); // null still last
  assert.deepEqual(names(sortTable(t, 0)), ["a", "B", "C"]); // text, case-insensitive order
  assert.deepEqual(names(sortTable(t, 1, false)), ["a", "B", "C"]); // ties keep table order
  assert.deepEqual(names(t), ["B", "a", "C"]); // input unchanged
});
