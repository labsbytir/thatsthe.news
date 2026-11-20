# Proposal

## Why

Breaking stories evolve by the minute but our articles are single static bodies. Readers need a live timeline per article with shareable updates, per-update social previews, named reporter credit, and no-refresh arrival of new updates.

## What Changes

- New EmDash collection `article_updates` keyed to articles by slug string (no assumed reverse-lookup support): body, publishedAt, pinned, status (draft/live/correction), reporter refs, correctionOf.
- Dual update addressing: fragment `#update-[id]` (CSS `:target` highlight, no JS) plus canonical `/articles/[slug]/updates/[id]` page doubling as the share/OG target.
- Dynamic per-update OG image route (Satori + resvg, zero paid services): update text in brutalist style with the SVG logo composited bottom-right; versioned by `updatedAt`.
- Reporter credits ("Journalist / Reporter @ [Publisher]", photo when available) with avatar-stack hover cards and `/reporters/[id]` pages aggregating updates, articles, and sightings.
- SSE endpoint per article plus a ~30-line client script: new updates prepend live; full server-rendered timeline and reload affordance when JS/SSE is unavailable.

## Capabilities

### New Capabilities

- `live-updates`: Update model, deep links, per-update OG images, SSE realtime delivery.
- `reporter-pages`: Reporter credits, hover cards, dataset aggregation pages.

### Modified Capabilities

- None.

## Impact

- `seed/seed.json` (new `article_updates` collection, reporter fields), new routes (`updates/[id]`, `og.png`, `events`), article page timeline slot + client script, reporter pages.
- New npm deps: `satori`, `@resvg/resvg-js` (pure npm, no browser).
- SSE connection load on the Node adapter; backoff + cache caps.
