# Proposal

## Why

Stories on thatsthe.news currently stand alone with no visible sourcing trail. Readers cannot see who published first, what is verified, or how coverage connects. Gather fixes this by continuously monitoring live sources and attaching a shared, verifiable source feed to every article.

## What Changes

- New native EmDash plugin `gather` (npm package in-repo) that monitors sources, records first-seen sightings, and maintains per-article source feeds with verification states.
- MediaCloud v4 directory/API as the seed for the source registry (collections → sources → feeds), with RSS/sitemap polling via cron; no scraping of mediacloud.org HTML.
- Public Astro components (20+): per-article source feed, timeline, badges, citations, and a brutalist PMTiles source-relationship map with hover overlays (weather, census).
- Brand integration: the supplied SVG wordmark becomes the masthead logo; the custom font stays deferred until the user uploads it to R2 (code reads it when present, system stack until then).
- PMTiles basemap hosted from R2 (plus local `/public` fallback for review); map style brutalist but legible.

## Capabilities

### New Capabilities

- `gather-source-feed`: Continuous source monitoring and the per-article shared feed — first-published attribution, sightings, verification states, citations.
- `source-graph-map`: Brutalist PMTiles map of source relationships with hover detail and pluggable overlay adapters (weather, census).
- `brand-assets`: SVG wordmark integration and deferred R2 font loading.

### Modified Capabilities

- None. `openspec/specs/` is empty (newsroom-cms is unarchived), so there is nothing to modify.

## Impact

- New: `plugins/gather/` (native plugin), `src/components/gather/*` (public components), `src/components/map/*`, `src/assets/logo.svg`, seed additions for source registry, R2 PMTiles config.
- Modified: `astro.config.mjs` (register plugin), `src/layouts/Base.astro` (logo), article page (feed + map slots), `package.json` (maplibre deps).
- External: MediaCloud API (key required, user-supplied), R2 bucket for `.pmtiles` + font (user provisions), weather/census overlay endpoints (read-only, allowlisted).
