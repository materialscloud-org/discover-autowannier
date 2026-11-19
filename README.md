# Automated Wannierisation

Validation results of an automated protocol for generating maximally-localised
Wannier functions (MLWFs) in a high-throughput framework, based on the selected
columns of the density matrix (SCDM) method: for 200 bulk materials, the
relaxed structure, the DFT (Quantum ESPRESSO, PBE) and Wannier-interpolated
band structures, and the band distances η, η<sub>max</sub> and total spread Ω
for several k-point spacings and methods (SCDM only, SCDM+MLWF, random
projections+MLWF).

V. Vitale, G. Pizzi, A. Marrazzo, J. R. Yates, N. Marzari, A. A. Mostofi,
_npj Computational Materials_ **6**, 66 (2020),
[doi:10.1038/s41524-020-0312-y](https://doi.org/10.1038/s41524-020-0312-y).
Data: [doi:10.24435/materialscloud:dd-nz](https://doi.org/10.24435/materialscloud:dd-nz).

A static single-page app, the port of the "Automated Wannierisation" section
of the legacy Materials Cloud frontend ([MIGRATION_NOTES.md](MIGRATION_NOTES.md)).

## Pages

- **Dashboard** (`/dashboard/ptable`, `/dashboard/list`, `/dashboard/plot`):
  select a compound with the periodic table (compounds containing all the
  selected elements), the table of η, η<sub>max</sub>, Ω at 0.2 Å⁻¹, or the
  plot of the change in η vs the relative change in spread with the MLWF step.
- **Compound** (`/details/<compound>`): the structure (3D, cell, sites,
  downloads), the properties per band manifold and method, and the DFT vs
  Wannier band structures per method and k-point spacing.

## Data

Two sources, both in `src/api.js`:

- `API`, the AiiDA REST API of the `autowannier` profile: structures and band
  structures, by node uuid.
- `DATA`, the compound summaries (`data/compounds.json`,
  `data/compounds/<name>.json`, in the format of the old discover backend),
  static files in `public/data/`: the old discover backend's responses,
  still served by `legacy-api.materialscloud.org`, downloaded by
  `scripts/fetchCompounds.mjs` (about 210 GET requests), which also keeps the
  responses as received in `raw/legacy-api/` (not published).

To download them again:

```bash
node scripts/fetchCompounds.mjs     # rewrites public/data/compounds.json and public/data/compounds/
pnpm test                           # includes the shape check of the files
```

If the legacy API is gone, `node scripts/rebuildFromAiida.mjs` rebuilds the
same files from the AiiDA REST API alone (about 3000 GET requests, cached in
`$AIIDA_CACHE`), without the band distances η, η<sub>max</sub>, which are not
in the AiiDA database.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # node --test tests/*.test.mjs
pnpm lint
pnpm build      # static site in dist/
```

## Layout

```
src/
  App.jsx               header and routes (react-router)
  AccordionContent.jsx  How to cite / About / Acknowledgements
  api.js                API (AiiDA), DATA (compound summaries), fetch helpers
  Autowannier/
    data.js             the data transformations (tested)
    Common.jsx          spinner, errors, compound names, provenance links
    Dashboard/          index.jsx (tabs, compounds query), PTable, List, Plot
    Details/            index.jsx (compound query, properties), Structure, Bands
  common/               could move to mc-react-library (each has a TODO):
                          PeriodicTable (mc-periodic-table), Plot (plotly),
                          BandsPlot (bands-visualiser, plotly.js)
public/data/            the compound summaries (generated, see Data)
raw/legacy-api/         the legacy API's responses as received (kept, not published)
scripts/fetchCompounds.mjs  downloads public/data/ from the legacy API
scripts/rebuildFromAiida.mjs  rebuilds it from the AiiDA REST API (fallback)
tests/                  data.test.mjs, compounds.test.mjs (shape of public/data/),
                        fixtures/ (one real band structure)
legacy/                 the original AngularJS files, for reference
```
