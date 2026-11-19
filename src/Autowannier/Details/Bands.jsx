// The band plots of a band manifold (structuredetails.html): one tab per
// method, one tab per k-point spacing; DFT bands (dark grey) against the
// Wannier-interpolated ones (dark red), both from the Fermi energy.
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useMemo, useState } from "react";

import { aiida } from "../../api.js";
import { Failed, Loading, Provenance } from "../Common.jsx";
import { bandTabs, fromFermi, scaled } from "../data.js";

// plotly (via bands-visualiser): loaded with the first band plot
const BandsPlot = lazy(() => import("../../common/BandsPlot.jsx"));

const WANNIER = { name: "Wannier-interpolated", line: { color: "#B2182B", width: 1.5 } };
const DFT = { name: "DFT", line: { color: "#444444", width: 1.5 } };
const FERMI_AT_ZERO = [0];
const ENERGY_RANGE = [-10, 10]; // eV from the Fermi energy, initially shown (zoom to see more)

const useBands = (uuid) =>
  useQuery({
    queryKey: ["bands", uuid],
    queryFn: async () => (await aiida(`nodes/${uuid}/contents/derived_properties/`)).derived_properties.bands,
    enabled: Boolean(uuid),
    // another tab's bands stay drawn while these load (the page doesn't jump)
    placeholderData: keepPreviousData,
  });

function Tabs({ items, active, onSelect }) {
  return (
    <ul className="flex flex-wrap border-b border-gray-300">
      {items.map((label, i) => (
        <li key={label}>
          <button
            type="button"
            onClick={() => onSelect(i)}
            className={`-mb-px rounded-t border px-3 py-1 ${
              i === active ? "border-gray-300 border-t-[#e36209] border-b-white bg-white" : "border-transparent text-gray-600"
            }`}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Plot({ mesh, dftUuid, fermiEnergy }) {
  const wannier = useBands(mesh.bands_node_uuid);
  const dft = useBands(dftUuid);
  const plot = useMemo(() => {
    if (!wannier.data || !dft.data) return null;
    const ef = fermiEnergy ?? 0;
    return {
      bandsDataArray: [
        { bandsData: fromFermi(dft.data, ef), traceFormat: DFT },
        { bandsData: fromFermi(wannier.data, ef), traceFormat: WANNIER },
      ],
      settings: { title: { text: "" }, showlegend: false, yaxis: { range: ENERGY_RANGE } },
    };
  }, [wannier.data, dft.data, fermiEnergy]);
  const error = wannier.error ?? dft.error;
  const loading = !plot || wannier.isPlaceholderData || wannier.isFetching || dft.isFetching;
  return (
    <div>
      <div className="mb-2 text-center">
        <div>
          DFT
          <Provenance uuid={dftUuid} />
          (dark grey) vs. Wannier-interpolated
          <Provenance uuid={mesh.bands_node_uuid} />
          (dark red).
        </div>
        <div>The zero of energy is set at the value of the Fermi energy returned by Quantum ESPRESSO.</div>
        <div>
          η: {scaled(mesh.eta, 1000, 1)} meV; η<sub>max</sub>: {scaled(mesh.eta_max, 1000, 1)} meV; Ω:{" "}
          {scaled(mesh.total_spread, 1, 2)} Å<sup>2</sup>.
        </div>
      </div>
      {/* a fixed height while loading or switching, so the page doesn't move */}
      <div className="relative h-[480px] w-full">
        {error ? (
          <Failed error={error} />
        ) : (
          plot && (
            <Suspense fallback={null}>
              <BandsPlot {...plot} fermiLevels={FERMI_AT_ZERO} className="h-full w-full" />
            </Suspense>
          )
        )}
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ManifoldBands({ label, data, dftUuid, fermiEnergy }) {
  const { methods, defaultMethod } = bandTabs(data);
  const [method, setMethod] = useState(defaultMethod);
  // the k-point spacing shown for each method
  const [meshes, setMeshes] = useState(() => methods.map((m) => m.defaultMesh));
  const current = methods[method];
  if (!current) return null;

  return (
    <section className="mx-auto max-w-[900px] space-y-3">
      <h3 className="text-center text-lg font-semibold">Band manifold: {label}</h3>
      <Tabs items={methods.map((m) => m.label)} active={method} onSelect={setMethod} />
      <p>
        Linear k-point spacing (Å<sup>-1</sup>)
      </p>
      <Tabs
        items={current.meshes.map((m) => m.mesh)}
        active={meshes[method]}
        onSelect={(i) => setMeshes(meshes.map((m, j) => (j === method ? i : m)))}
      />
      <Plot mesh={current.meshes[meshes[method]]} dftUuid={dftUuid} fermiEnergy={fermiEnergy} />
    </section>
  );
}
