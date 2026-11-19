// A band structure drawn by bands-visualiser (plotly.js) in a React element,
// redrawn when its props change (pass memoized props).
// TODO: elevate up to mc-react-library
import { BandsVisualiser } from "bands-visualiser";
import Plotly from "plotly.js-basic-dist-min";
import { useEffect, useRef } from "react";

export default function BandsPlot({ bandsDataArray, fermiLevels = [], settings = {}, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    BandsVisualiser(ref.current, { bandsDataArray, fermiLevels, settings });
  }, [bandsDataArray, fermiLevels, settings]);

  useEffect(() => {
    const el = ref.current;
    return () => Plotly.purge(el);
  }, []);

  return <div ref={ref} className={className} />;
}
