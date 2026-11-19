// The structure of a compound (the jsmol-viz directive and the "Structure
// cell vectors" / "Structure atomic coordinates" tables of structuredetails.html),
// from the attributes of its StructureData node.
import { useQuery } from "@tanstack/react-query";
import { fromStructureData } from "matsci-parse";
import { StructDownloadButton } from "mc-react-library";
import StructureVisualizer from "mc-react-structure-visualizer";

import { API, aiida } from "../../api.js";
import { Failed, Loading, Provenance } from "../Common.jsx";

const useAttributes = (uuid) =>
  useQuery({
    queryKey: ["attributes", uuid],
    queryFn: async () => (await aiida(`nodes/${uuid}/contents/attributes/`)).attributes,
  });

export function StructureView({ uuid }) {
  const { data, error, isPending } = useAttributes(uuid);
  if (isPending) return <Loading />;
  if (error) return <Failed error={error} />;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm italic text-gray-600">
        <span>Drag to rotate, scroll to zoom</span>
        <span className="flex items-center gap-2">
          Download structure:
          <StructDownloadButton aiida_rest_url={API.replace(/\/$/, "")} uuid={uuid} />
        </span>
      </div>
      <div className="h-[450px] w-full">
        <StructureVisualizer structure={fromStructureData(data)} initSupercell={[2, 2, 2]} />
      </div>
    </div>
  );
}

const fixed = (v) => v.toFixed(6);
const th = "border-b border-gray-300 px-2 py-1";
const td = "px-2 py-1 font-mono text-sm";

function Table({ title, uuid, header, rows }) {
  return (
    <div>
      <h3 className="mb-2 text-center font-semibold">
        {title}
        <Provenance uuid={uuid} />
      </h3>
      <table className="w-full text-right">
        <thead>
          <tr>
            {header.map((h) => (
              <th key={h} className={th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export function StructureTables({ uuid }) {
  const { data, error, isPending } = useAttributes(uuid);
  if (isPending) return <Loading />;
  if (error) return <Failed error={error} />;
  const kinds = Object.fromEntries(data.kinds.map((k) => [k.name, k]));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Table
        title="Structure cell vectors"
        uuid={uuid}
        header={["", "x [Å]", "y [Å]", "z [Å]"]}
        rows={data.cell.map((v, i) => (
          <tr key={i}>
            <th className="px-2 py-1">
              v<sub>{i + 1}</sub>
            </th>
            {v.map((x, j) => (
              <td key={j} className={td}>
                {fixed(x)}
              </td>
            ))}
          </tr>
        ))}
      />
      <Table
        title="Structure atomic coordinates"
        uuid={uuid}
        header={["Kind label", "x [Å]", "y [Å]", "z [Å]"]}
        rows={data.sites.map((site, i) => {
          const kind = kinds[site.kind_name];
          return (
            <tr key={i}>
              <th
                className="px-2 py-1"
                title={kind && `Mass: ${kind.mass} a.m.u.\nElement${kind.symbols.length > 1 ? "s" : ""}: ${kind.symbols.join(", ")}`}
              >
                {site.kind_name}
              </th>
              {site.position.map((x, j) => (
                <td key={j} className={td}>
                  {fixed(x)}
                </td>
              ))}
            </tr>
          );
        })}
      />
    </div>
  );
}
