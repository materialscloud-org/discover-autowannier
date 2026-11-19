# Migration notes: AngularJS section → static single-page app

## Original

The `scdm` section of the legacy Materials Cloud frontend
(`legacy-frontend-docker/frontend-discover`, routes `/autowannier/…`), copied
to [`legacy/`](legacy/README.md): a dashboard with three selection views
(periodic table, list, plot) and a page per compound. It read the compound
list and summaries from the Materials Cloud discover backend, and the
structures and band structures from the AiiDA REST API.

## Now

A static Vite/React site.

- **AiiDA:** one constant, `API` in `src/api.js`: structures
  (`nodes/<uuid>/contents/attributes/`, parsed with matsci-parse
  `fromStructureData`), band structures (`.../derived_properties/`) and
  structure downloads.
- **Compound summaries:** the discover backend's responses, still served by
  `legacy-api.materialscloud.org/api/v2/discover/scdm/compounds[/<name>]`,
  downloaded by `scripts/fetchCompounds.mjs`: as received into
  `raw/legacy-api/` (kept, not published) and their `data` member into
  `public/data/` (the files the app reads at `data/`). 210 compounds, 281
  table rows. They agree with the AiiDA database (same structure node for 209
  of 210 compounds, same band nodes and spreads for all 2,552 Wannier runs).
  `scripts/rebuildFromAiida.mjs` rebuilds them from the AiiDA API alone if the
  legacy API goes, without η / η<sub>max</sub> (not in the database).
- **Pages** (`src/Autowannier/`): dashboard (periodic table, list, plot) and
  compound page (structure, properties, band plots per manifold / method /
  k-point spacing). The compound page loads on demand.
- **Libraries:** mc-periodic-table, plotly.js (plot and bands), bands-visualiser
  (bands, energies from the Fermi energy, initial range ±10 eV),
  mc-react-structure-visualizer (structure, 2×2×2), mc-react-library
  (header, provenance buttons). `src/common/`: components that could move to
  mc-react-library.

## Bugs of the original not reproduced

- The periodic-table search ignored the selected elements (and the reverse);
  here both filter the list. The search is a case-insensitive substring.
- Without a SCDM+MLWF entry no method tab was shown; here the first method is.
- The default k-point tab was wrong for some methods; here each method has its
  own.
- The properties panel crashed for a method without a 0.2 entry; here N/A.

## Left out

The JSmol overlay and menu, the CHEMDOODLE download (CIF, XSF, XYZ remain),
"Back to top", and the bands plot's path editing.

## Tests

`pnpm test`: the transformations of `src/Autowannier/data.js` against the old
controllers' formulas (with one real AiiDA band structure), and the shape of
`public/data/`.

## Open questions

1. `patches/mc-react-structure-visualizer@0.11.1.patch`: the visualizer
   bundles mc-periodic-table 0.1.4 and registers `<periodic-table>` without
   checking, which throws next to the app's 0.2. Fix it in the visualizer and
   drop the patch.
2. bands-visualiser 0.0.3 logs its input to the console on every draw.
3. Old URLs (`/discover/autowannier/…`) are redirected elsewhere, not by this
   app.
