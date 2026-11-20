# Tasks

## 1. Update model and routes

- [ ] 1.1 Add `article_updates` collection to the seed (slug-keyed, pinned, status, correctionOf) and verify seed validation passes
- [ ] 1.2 Render the timeline slot on the article page (pinned/newest order, Corrected badges) and verify ordering with fixture updates
- [ ] 1.3 Build `/articles/[slug]/updates/[id]` pages with self canonical + back-to-fragment link and verify HTTP 200 and backlink
- [ ] 1.4 Verify fragment `#update-[id]` scrolls and highlights with JS disabled

## 2. OG images and realtime

- [ ] 2.1 Add `satori` + `@resvg/resvg-js` deps and build the `og.png` route with logo bottom-right and verify the PNG contains update text and logo
- [ ] 2.2 Version OG URLs by `updatedAt` and verify an edit changes the URL while the article OG stays fixed
- [ ] 2.3 Build the SSE `events` endpoint + client prepend/patch script and verify a publish appears without reload
- [ ] 2.4 Verify no-JS fallback: full timeline renders with reload affordance and no console errors

## 3. Reporters and verification

- [ ] 3.1 Implement reporter credits (role @ publisher, photo/initials, avatar-stack hover cards) and verify two-reporter hover cards
- [ ] 3.2 Build `/reporters/[id]` aggregation (updates, articles, sightings) and verify empty sections hide
- [ ] 3.3 Run `npm run typecheck` and `npm run build`, verify route curls, then run `openspec validate live-timeline --strict` and verify it passes

## Workflow follow-up

- Resolve reference-vs-slug key and reporter-profile shape at implementation start (see Open Questions).
