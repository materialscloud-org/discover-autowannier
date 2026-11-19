// selectionplot.html: change in bands distance vs relative change in total
// spread before and after the MLWF step (a Highcharts scatter plot in the old
// page); a point opens the compound.
import { useCallback, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import Plot from "../../common/Plot.jsx";
import { scatterSeries } from "../data.js";

const COLORS = { Isolated: "#7070F9", Entangled: "#FA775B" };

const LAYOUT = {
  height: 450,
  margin: { t: 20 },
  hovermode: "closest",
  xaxis: { title: { text: "ΔΩ/Ω<sub>MLWF</sub> (%)" }, range: [0, 100] },
  yaxis: { title: { text: "Δη (meV)" }, range: [-10, 10] },
  legend: { x: 1, y: 0.8 },
};

const subscripts = (formula) => formula.replace(/(\d+)/g, "<sub>$1</sub>");

export default function CompoundsPlot() {
  const { table_data } = useOutletContext();
  const navigate = useNavigate();

  const data = useMemo(
    () =>
      scatterSeries(table_data).map((s) => ({
        type: "scatter",
        mode: "markers",
        name: s.manifold,
        x: s.x,
        y: s.y,
        customdata: s.compounds,
        marker: { color: COLORS[s.manifold], size: 9 },
        hovertemplate: s.compounds.map(
          (c, i) =>
            `<b>Compound</b>: ${subscripts(c)}` +
            "<br><b>Relative change in spread (%)</b>: %{x:.1f}" +
            "<br><b>Change in bands distance (meV)</b>: %{y:.2f}" +
            `<br><b>SCDM+MLWF η (meV)</b>: ${s.mlwf[i][0]}` +
            `<br><b>SCDM+MLWF η<sub>max</sub> (meV)</b>: ${s.mlwf[i][1]}` +
            `<br><b>SCDM+MLWF Ω (Å<sup>2</sup>)</b>: ${s.mlwf[i][2]}` +
            "<br>Click to go to the detail page<extra></extra>",
        ),
      })),
    [table_data],
  );

  const onClick = useCallback(
    (e) => navigate(`/details/${encodeURIComponent(e.points[0].customdata)}`),
    [navigate],
  );

  return (
    <div>
      <p className="mb-6">
        Change in bands distance η vs. relative change in total spread ΔΩ/Ω<sub>MLWF</sub> for the suggested
        k-point linear density of 0.2 Å<sup>-1</sup>, before and after the MLWF step
      </p>
      {data.every((s) => s.y.every((y) => y === null)) && (
        <p className="mb-6 text-center text-gray-600">
          The bands distances η are not available (they are not in the AiiDA database), so there are no points.
        </p>
      )}
      <Plot data={data} layout={LAYOUT} onClick={onClick} className="mx-auto w-full max-w-[1000px]" />
    </div>
  );
}
