// The mc-periodic-table web component as a multi-select element picker:
// elements not in `enabled` are greyed out and cannot be clicked.
// TODO: elevate up to mc-react-library (acwf-verification and
// tools-optimadeclient-react each have their own PTableWrapper)
import { symbols } from "mc-periodic-table";
import { useEffect, useRef } from "react";

export default function PeriodicTable({ enabled, selected = [], onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    const pt = ref.current;
    pt.stateCount = 2; // off / selected
    pt.fields = { center: (z) => symbols[z] };
    const handle = (e) =>
      onChange(
        Object.entries(e.detail)
          .filter(([, state]) => state > 0)
          .map(([z]) => symbols[Number(z)]),
      );
    pt.addEventListener("change", handle);
    // cells scale with the width of the page
    const resize = new ResizeObserver(() => {
      const cell = Math.min(54, pt.parentElement.clientWidth / 19);
      pt.style.setProperty("--cell-size", `${cell}px`);
      pt.style.setProperty("--font-size", `${cell / 3}px`);
      pt.style.setProperty("--gap", `${cell / 14}px`);
      pt.style.setProperty("--f-offset", `${cell / 3}px`);
    });
    resize.observe(pt.parentElement);
    return () => {
      pt.removeEventListener("change", handle);
      resize.disconnect();
    };
  }, [onChange]);

  useEffect(() => {
    const allowed = new Set(enabled);
    const pt = ref.current;
    for (let z = 1; z < symbols.length; z++) {
      if (symbols[z]) pt.setCellInteraction([z], allowed.has(symbols[z]) ? "normal" : "noInteractive");
    }
  }, [enabled]);

  // a selection set from outside (e.g. cleared): redraw the cells
  useEffect(() => {
    const pt = ref.current;
    const current = Object.entries(pt.getState())
      .filter(([, state]) => state > 0)
      .map(([z]) => symbols[Number(z)]);
    if ([...current].sort().join() !== [...selected].sort().join()) {
      pt.setState(Object.fromEntries(selected.map((s) => [symbols.indexOf(s), 1])));
    }
  }, [selected]);

  return (
    <div className="flex w-full justify-center pb-8">
      <periodic-table ref={ref} />
    </div>
  );
}
