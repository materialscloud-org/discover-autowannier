#!/usr/bin/env node
// Downloads the compound summaries of the old Materials Cloud discover backend,
// still served at https://legacy-api.materialscloud.org/api/v2/discover/scdm/:
// the responses as received into raw/legacy-api/ (kept, not published), and
// their "data" member into public/data/ (served with the app at data/):
//
//   public/data/compounds.json         { data: { compounds: [...], table_data: [[...], ...] } }
//   public/data/compounds/<name>.json  { data: { <name>: { structure_uuid, fermi_energy, bands } } }
//
//   node scripts/fetchCompounds.mjs
//
// One request for the list, one per compound (~210), at most 4 in flight.
// If the legacy API is gone, scripts/rebuildFromAiida.mjs rebuilds the same
// files from the AiiDA database (without eta / eta_max).
import { mkdir, rm, writeFile } from "node:fs/promises";

const LEGACY = "https://legacy-api.materialscloud.org/api/v2/discover/scdm/compounds";
const OUT = new URL("../public/data/", import.meta.url);
const RAW = new URL("../raw/legacy-api/", import.meta.url);

async function get(url, tries = 4) {
  for (let i = 1; ; i++) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": "materialscloud-autowannier-build" } });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (e) {
      if (i >= tries) throw new Error(`${url}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
}

// the app keeps only the "data" member: the rest (method, path, url) describes the request
const appData = (text) => JSON.stringify({ data: JSON.parse(text).data });

const listText = await get(LEGACY);
const list = JSON.parse(listText);
const names = list.data.compounds;
const details = new Map();
const queue = [...names];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const name = queue.shift();
      details.set(name, await get(`${LEGACY}/${encodeURIComponent(name)}`));
    }
  }),
);

for (const dir of [OUT, RAW]) {
  await rm(new URL("compounds/", dir), { recursive: true, force: true });
  await mkdir(new URL("compounds/", dir), { recursive: true });
}
await writeFile(new URL("compounds.json", RAW), listText);
await writeFile(new URL("compounds.json", OUT), appData(listText));
for (const [name, text] of details) {
  await writeFile(new URL(`compounds/${name}.json`, RAW), text);
  await writeFile(new URL(`compounds/${name}.json`, OUT), appData(text));
}
console.log(`${names.length} compounds, ${list.data.table_data.length} table rows -> raw/legacy-api/, public/data/`);
