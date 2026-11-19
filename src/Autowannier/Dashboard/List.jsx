import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { CompoundName } from "../Common.jsx";
import { sortTable, tableRows } from "../data.js";

const th = "border-b border-gray-300 px-2 py-1";

/** a column heading that sorts the table by its column (again: the other way) */
function SortHeading({ column, sort, onSort, className = "", children }) {
  const active = sort.column === column;
  return (
    <th className={`${th} ${className}`} aria-sort={active ? (sort.ascending ? "ascending" : "descending") : "none"}>
      <button type="button" className="cursor-pointer whitespace-nowrap hover:text-[#337ab7]" onClick={() => onSort(column)}>
        {children}
        <span className="ml-1 inline-block w-3 text-xs">{active ? (sort.ascending ? "▲" : "▼") : ""}</span>
      </button>
    </th>
  );
}

export default function CompoundsList() {
  const { table_data } = useOutletContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  // by formula until another heading is clicked
  const [sort, setSort] = useState({ column: 0, ascending: true });
  const onSort = (column) =>
    setSort((s) => ({ column, ascending: s.column === column ? !s.ascending : true }));
  const sorted = sortTable(table_data, sort.column, sort.ascending);
  const rows = tableRows(sorted).filter((r) =>
    r.compound.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <p>
        Table with values of the average bands distance η, max bands distance η
        <sub>max</sub> and total spread Ω for the suggested k-point linear
        density of 0.2 Å<sup>-1</sup>.
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
              <SortHeading column={0} sort={sort} onSort={onSort} className="text-left">
                Formula
              </SortHeading>
              <SortHeading column={1} sort={sort} onSort={onSort} className="text-left">
                Band manifold
              </SortHeading>
              {/* columns 2-4: SCDM only, 5-7: SCDM+MLWF */}
              {[2, 5].map((first) => (
                <Metrics key={first} first={first} sort={sort} onSort={onSort} />
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="cursor-pointer border-b border-gray-100 hover:bg-gray-100"
                onClick={() =>
                  navigate(`/details/${encodeURIComponent(r.compound)}`)
                }
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

function Metrics({ first, sort, onSort }) {
  return (
    <>
      <SortHeading column={first} sort={sort} onSort={onSort}>
        η (meV)
      </SortHeading>
      <SortHeading column={first + 1} sort={sort} onSort={onSort}>
        η<sub>max</sub> (meV)
      </SortHeading>
      <SortHeading column={first + 2} sort={sort} onSort={onSort}>
        Ω (Å<sup>2</sup>)
      </SortHeading>
    </>
  );
}
