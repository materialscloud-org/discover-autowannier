// Where the data comes from.
//
// The one coupling to the backend: the AiiDA REST API (v4) of the
// "autowannier" profile. The details page reads from it the structures
// (/nodes/<uuid>/contents/attributes/) and band structures
// (/nodes/<uuid>/contents/derived_properties/), and links to its downloads.
export const API = "https://aiida.materialscloud.org/autowannier/api/v4/";

// The compound summaries: the old discover backend's responses
// (legacy-api.materialscloud.org/api/v2/discover/scdm/compounds[/<name>]),
// downloaded by scripts/fetchCompounds.mjs into public/data/, served with the
// app at data/:
//   data/compounds.json          { data: { compounds: [...], table_data: [[...], ...] } }
//   data/compounds/<name>.json   { data: { <name>: { structure_uuid, fermi_energy, bands } } }
export const DATA = `${import.meta.env.BASE_URL}data/`;

// Provenance links ("Browse provenance", the AiiDA logo).
export const EXPLORE = "https://www.materialscloud.org/explore/autowannier";

export async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} (${url})`);
  return response.json();
}

/** the "data" member of an AiiDA REST API response */
export const aiida = async (path) => (await getJson(API + path)).data;
