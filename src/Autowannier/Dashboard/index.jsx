import { useQuery } from "@tanstack/react-query";
import { NavLink, Outlet } from "react-router-dom";

import InfoAccordions from "../../AccordionContent.jsx";
import { DATA, getJson } from "../../api.js";
import { Failed, Loading, JsonButton } from "../Common.jsx";

const VIEWS = [
  ["ptable", "Periodic table"],
  ["list", "List"],
  ["plot", "Plot"],
];

export default function Dashboard() {
  const url = `${DATA}compounds.json`;
  // { compounds: [name, ...], table_data: [[name, manifold, 6 values], ...] }
  const query = useQuery({
    queryKey: ["compounds"],
    queryFn: async () => (await getJson(url)).data,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p>
          Validation results of an automated protocol for generating
          maximally-localized Wannier functions in a high-throughput framework.
        </p>
        <JsonButton href={url} />
      </div>
      <div className="mx-auto max-w-4xl space-y-3">
        <InfoAccordions />
      </div>
      <nav className="flex justify-center gap-1 border-b border-gray-300">
        {VIEWS.map(([path, label]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `-mb-px border-b-2 px-4 py-2 hover:no-underline ${
                isActive
                  ? "border-[#e36209] font-semibold text-gray-900"
                  : "border-transparent text-gray-600"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <Failed error={query.error} />
      ) : (
        <Outlet context={query.data} />
      )}
    </div>
  );
}
