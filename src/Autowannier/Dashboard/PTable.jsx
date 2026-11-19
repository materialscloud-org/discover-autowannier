import { useCallback, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import PeriodicTable from "../../common/PeriodicTable.jsx";
import { CompoundName } from "../Common.jsx";
import { elementsOfAll, withElements } from "../data.js";

export default function CompoundsPTable() {
  const { compounds } = useOutletContext();
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const onChange = useCallback((elements) => {
    setSelected(elements);
    // (an empty selection is also what the table reports after being cleared by a search)
    if (elements.length) setSearch("");
  }, []);

  const matching = useMemo(
    () => withElements(compounds, selected),
    [compounds, selected],
  );
  const enabled = useMemo(
    () => [...new Set([...elementsOfAll(matching), ...selected])],
    [matching, selected],
  );
  const listed = matching.filter((c) =>
    c.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="w-full lg:w-56 lg:shrink-0">
        <input
          type="text"
          className="mb-2 w-full rounded border border-gray-400 px-2 py-1"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value.trim()) setSelected([]);
          }}
        />
        <ul className="max-h-[420px] overflow-y-auto rounded border border-gray-300">
          {listed.map((c) => (
            <li key={c} className="border-b border-gray-200 last:border-b-0">
              <Link
                to={`/details/${encodeURIComponent(c)}`}
                className="block px-3 py-1 hover:bg-gray-100"
              >
                <CompoundName compound={c} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 flex-1">
        <PeriodicTable
          enabled={enabled}
          selected={selected}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
