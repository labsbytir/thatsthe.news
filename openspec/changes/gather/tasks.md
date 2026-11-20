# Tasks

## 1. Plugin core (native)

- [x] 1.1 Scaffold `plugins/gather/` (package, manifest, `definePlugin()` descriptor with cron + content/API capabilities) and verify `npx astro check` resolves the descriptor import
- [x] 1.2 Implement storage collections (sources, sightings, article-links with verification state) and verify a round-trip put/query/delete test passes
- [x] 1.3 Implement MediaCloud directory sync (collections → sources → feeds, idempotent upsert keyed by canonical URL) and verify a second sync creates zero duplicates
- [x] 1.4 Implement feed poller (RSS/sitemap fetch via allowlisted `ctx.http`, first-seen sightings) and verify a fixture feed with one new URL yields exactly one sighting
- [x] 1.5 Implement story matcher (candidate sightings → article links) plus verification state machine (unverified/corrob/verified/disputed) and verify state transitions persist per link
- [x] 1.6 Document plugin env (`MEDIACLOUD_API_KEY`, R2 PMTiles URL, overlay URLs) in `plugins/gather/README.md` and verify each variable is read in exactly one place

## 2. Plugin API and admin UI

- [x] 2.1 Expose REST routes (per-article feed oldest-first, sources list, verification update) and verify `curl` returns oldest-first JSON with first-published flag
- [x] 2.2 Build React admin overview page (source registry table + sync status) and verify it renders seeded sources without errors
- [x] 2.3 Build verification queue UI (pending links with verify/dispute actions) and verify an action updates the public feed on next request
- [x] 2.4 Add empty/error states for API and admin (no key, poll failure, no sightings) and verify each state renders its notice

## 3. Public feed components (brutalist)

- [ ] 3.1 Build `SourceFeed` + `SourceFeedItem` (oldest-first list slot for article pages) and verify two seeded sightings render in first-seen order
- [ ] 3.2 Build `FirstPublishedBadge` + `VerificationBadge` and verify the earliest entry shows first-published and verified entries show verified
- [ ] 3.3 Build `VerificationTimeline` (unverified → corroborated → verified progression) and verify a disputed link renders the disputed branch
- [ ] 3.4 Build `SourceList` (all monitored sources with collection labels) and verify it links each source homepage
- [ ] 3.5 Build `CitationList` (source name, title, URL, first-seen per entry) and verify output contains all four fields per entry
- [ ] 3.6 Build `LivePulse` polling indicator + `FeedEmpty`/`FeedError` states and verify each renders without layout shift
- [ ] 3.7 Slot feed + citations into `src/pages/articles/[slug].astro` and verify HTTP 200 with feed markers present

## 4. Source graph map (PMTiles + MapLibre)

- [ ] 4.1 Add `maplibre-gl` + `pmtiles` deps and R2/local-fallback loader config, and verify `npm run build` succeeds with the new deps
- [ ] 4.2 Build brutalist basemap style (paper background, black 3px linework, monospace labels, single accent) and verify tiles render from the local `/public` fallback
- [ ] 4.3 Build `SourceMap` + `SourceNodeLayer` + `SourceEdgeLayer` (co-linkage edges) and verify two co-linked sources show connected nodes
- [ ] 4.4 Build `MapTooltip` hover panel (source detail + weather + census summaries) and verify hover shows all three when adapters return data
- [ ] 4.5 Implement weather + census overlay adapters with KV caching and graceful omission, and verify adapter failure still leaves source detail visible
- [ ] 4.6 Build `MapLegend` + layer toggles and phone-width collapse, and verify no page-level horizontal overflow at 390px
- [ ] 4.7 Slot map into article + section templates with unavailable-state fallback, and verify missing-archive URL renders the fallback

## 5. Brand assets

- [x] 5.1 Add `src/assets/thatsthe-news-logo.svg` and wire into masthead linking `/` with text fallback, and verify homepage shows the SVG wordmark
- [x] 5.2 Add deferred R2 font hook (`@font-face` gated on configured URL, `font-display: swap`) and verify no font request fires when unconfigured

## 6. Integration verify and hand back

- [ ] 6.1 Run `npm run typecheck` and `npm run build` and verify zero errors
- [ ] 6.2 Verify HTTP 200 on `/`, an article page (feed + citations markers), a section page, and the map route, plus 404 on unknown slugs
- [ ] 6.3 Run `openspec validate gather --strict` and verify it passes before the final commit
- [ ] 6.4 Commit and push per group on `sandbox` and report review URLs, what is editable, and what is still deferred (font upload, production R2, overlay provider picks)

## Workflow follow-up

- Archive the `gather` change after review requirements are satisfied.
- Plan Rundown as the next change consuming Gather's feed API; keep Vibe/Graph/Trends out of this change.
