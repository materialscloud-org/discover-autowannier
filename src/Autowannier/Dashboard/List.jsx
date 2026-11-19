// selectionlist.html: the table of all compounds (a DataTable with a formula
// search in the old page); a row opens the compound.
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { CompoundName } from "../Common.jsx";
import { tableRows } from "../data.js";

const th = "border-b border-gray-300 px-2 py-1";

export default function CompoundsList() {
  const { table_data } = useOutletContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const rows = tableRows(table_data).filter((r) =>
    r.compound.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <p>
        Table with values of the average bands distance η, max bands distance η<sub>max</sub> and total spread Ω
        for the suggested k-point linear density of 0.2 Å<sup>-1</sup>.
      </p>
      <input
        type="text"
        className="rounded border border-gray-400 px-2 py-1"
        placeholder="Search formula"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr>
              <th colSpan={2} />
              <th colSpan={3} className={`${th} text-center`}>
                SCDM only
              </th>
              <th colSpan={3} className={`${th} text-center`}>
                SCDM+MLWF
              </th>
            </tr>
            <tr>
              <th className={`${th} text-left`}>Formula</th>
              <th className={`${th} text-left`}>Band manifold</th>
              {[0, 1].map((i) => (
                <Metrics key={i} />
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="cursor-pointer border-b border-gray-100 hover:bg-gray-100"
                onClick={() => navigate(`/details/${encodeURIComponent(r.compound)}`)}
              >
                <td className="px-2 py-1 text-left">
                  <CompoundName compound={r.compound} />
                </td>
                <td className="px-2 py-1 text-left">{r.manifold}</td>
                {[...r.scdmOnly, ...r.scdmMlwf].map((v, j) => (
                  <td key={j} className="px-2 py-1">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Metrics() {
  return (
    <>
      <th className={th}>η (meV)</th>
      <th className={th}>
        η<sub>max</sub> (meV)
      </th>
      <th className={th}>
        Ω (Å<sup>2</sup>)
      </th>
    </>
  );
}
