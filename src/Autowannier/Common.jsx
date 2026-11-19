// Pieces shared by the pages.
import { ExploreButton, McloudSpinner, formatChemicalFormula } from "mc-react-library";

import { EXPLORE } from "../api.js";
import { splitName } from "./data.js";

export function Loading() {
  return (
    <div className="flex justify-center py-10">
      <McloudSpinner />
    </div>
  );
}

export function Failed({ error }) {
  return <p className="py-4 text-red-700">Could not load the data: {String(error?.message ?? error)}</p>;
}

/** Si2O4-1 -> Si₂O₄ [1] */
export function CompoundName({ compound }) {
  const { formula, suffix } = splitName(compound);
  return (
    <>
      {formatChemicalFormula(formula)}
      {suffix && ` [${suffix}]`}
    </>
  );
}

/** the AiiDA logo linking to the node in the explore section */
export function Provenance({ uuid }) {
  if (!uuid) return null;
  return <ExploreButton explore_url={EXPLORE} uuid={uuid} className="mx-1 inline-block align-middle" />;
}

/** a link to the page's data as JSON (the old pages' "Get data from REST API" button) */
export function JsonButton({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-block rounded bg-[#337ab7] px-2 py-1 text-sm text-white hover:bg-[#286090] hover:text-white hover:no-underline"
    >
      Get data as JSON
    </a>
  );
}
