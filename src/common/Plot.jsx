// A plotly.js figure (the library is loaded with the first plot), from
// molecular-vibration-explorer, with a click handler (plotly_click).
// TODO: elevate up to mc-react-library
import { useEffect, useRef, useState } from "react";

const loadPlotly = () => import("plotly.js-basic-dist-min").then((m) => m.default ?? m);

const CONFIG = { displaylogo: false, responsive: true };

export default function Plot({ data, layout, onClick, className = "" }) {
  const ref = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const el = ref.current;
    loadPlotly()
      .then((Plotly) => {
        if (cancelled || !el) return;
        Plotly.react(el, data, layout, CONFIG);
        el.removeAllListeners?.("plotly_click");
        if (onClick) el.on("plotly_click", onClick);
      })
      .catch((e) => setError(String(e)));
    return () => {
      cancelled = true;
    };
  }, [data, layout, onClick]);

  useEffect(() => {
    const el = ref.current;
    return () => {
      loadPlotly().then((Plotly) => Plotly.purge(el));
    };
  }, []);

  if (error) return <p className="text-red-700">Could not draw the plot: {error}</p>;
  return <div ref={ref} className={className} />;
}
