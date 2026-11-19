// structuredetails.html: the page of a compound.
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { DATA, getJson } from "../../api.js";
import { CompoundName, Failed, Loading, Provenance, JsonButton } from "../Common.jsx";
import { MANIFOLDS, propertiesSummary } from "../data.js";
import ManifoldBands from "./Bands.jsx";
import { StructureTables, StructureView } from "./Structure.jsx";

const METRIC_LABELS = [
  <>average bands distance η (meV)</>,
  <>
    max bands distance η<sub>max</sub> (meV)
  </>,
  <>
    total spread Ω (Å<sup>2</sup>)
  </>,
];

function Properties({ details }) {
  return (
    <div className="rounded border border-gray-300">
      <div className="border-b border-gray-300 bg-gray-50 px-3 py-2">
        <h3 className="font-semibold">Info and properties</h3>
        <span className="text-sm">
          Values for linear k-point spacing of 0.2 Å<sup>-1</sup>
        </span>
      </div>
      <div className="divide-y divide-gray-200 px-3">
        {propertiesSummary(details).map((manifold) => (
          <div key={manifold.key} className="py-2">
            <h4 className="font-semibold text-[#c62828]">Band manifold: {manifold.label}</h4>
            {manifold.methods.map((method) => (
              <div key={method.key} className="py-1">
                <h5 className="font-semibold">
                  Method: {method.label}
                  <Provenance uuid={method.uuid} />
                </h5>
                <dl className="pl-6 text-sm">
                  {method.metrics.map((value, i) => (
                    <div key={i} className="flex gap-2">
                      <dt>{METRIC_LABELS[i]}:</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Details() {
  const { compound } = useParams();
  const url = `${DATA}compounds/${encodeURIComponent(compound)}.json`;
  const query = useQuery({
    queryKey: ["compound", compound],
    queryFn: async () => {
      const details = (await getJson(url)).data[compound];
      if (!details) throw new Error(`Data is not available for ${compound}`);
      return details;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl">
          Compound: <CompoundName compound={compound} />
        </h2>
        <JsonButton href={url} />
      </div>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <Failed error={query.error} />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <StructureView uuid={query.data.structure_uuid} />
            <Properties details={query.data} />
          </div>
          <hr className="border-gray-200" />
          <StructureTables uuid={query.data.structure_uuid} />
          {MANIFOLDS.filter((m) => query.data.bands.Wannier[m.key]).map((m) => (
            <div key={m.key}>
              <hr className="mb-6 border-gray-200" />
              <ManifoldBands
                label={m.label}
                data={query.data.bands.Wannier[m.key]}
                dftUuid={query.data.bands.DFT_uuid}
                fermiEnergy={query.data.fermi_energy}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
