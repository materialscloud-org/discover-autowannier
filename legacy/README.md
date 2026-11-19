# The original AngularJS section

Copied with `git show HEAD:<path>` from the `frontend-discover` submodule of
`legacy-frontend-docker` (the `scdm` section, routes `/autowannier/...`), for
reference only (not built, not linted).

- `scripts/controllers/`: `structureselection.js` (dashboard views),
  `structuredetails.js` (compound page)
- `scripts/services/`: `scdmservice.js` (discover backend requests),
  `graphservice.js` (Highcharts scatter plot), `mcloudconfig.js` (endpoints)
- `scripts/directives/`: `periodictable.js`, `jsmolviz.js` (shared)
- `scripts/app.routes-autowannier.js`: the section's routes, an excerpt of `app/scripts/app.js`
- `views/scdm/`: the section's templates; `views/shared/`: the directives' templates
- `styles/`, `images/scdm.png`

The band plots used the `bands-widget` npm package (not copied), the
structure view JSmol (not copied).
