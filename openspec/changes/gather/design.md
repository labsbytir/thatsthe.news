# Design

## Context

See proposal.md for motivation. Current state: Astro + EmDash Node starter on `sandbox`, SQLite + local storage, server output, brutalist theme in `src/styles/theme.css`. No plugins registered. MediaCloud access is via v4 API (key user-supplied); PMTiles docs confirm single-file archives over HTTP range requests rendered with MapLibre GL. Logo supplied as SVG file; Vexorium Bold + Montserrat embedded locally.

## Goals / Non-Goals

**Goals:**
- Native in-repo Gather plugin: source registry, cron polling, sightings, verification, REST routes, React admin pages.
- 20+ public components: source feed family + citations + PMTiles graph map with hover overlays.
- Logo wired now; Vexorium Bold + Montserrat embedded locally with preloads (no R2 font fetch).

**Non-Goals:**
- No Rundown/Velocity/Vision/Audo/Trends/Vibe/Graph/Inbox plugins in this change.
- No automated story writing, sentiment scoring, or social scraping.
- No R2 provisioning or credential handling by the agent; user supplies MediaCloud key and R2 PMTiles URL.
- No in-place PMTiles mutation; overlays are read-only adapters with graceful degradation.

## Decisions

- **Native plugin (`plugins/gather/`, `definePlugin()` descriptor, registered in `astro.config.mjs`) over sandboxed.** Rationale: needs React admin pages, Portable Text citation block rendering, and page-fragment map assets; sandboxed format cannot provide those. Alternative sandboxed considered — rejected per EmDash choosing-a-format guidance.
- **MediaCloud v4 API + RSS/sitemap polling, never HTML scraping.** Rationale: directory page is a browser UI; the supported contract is `DirectoryApi`/`SearchApi` plus feed URLs. Poll via `ctx.http` with declared host allowlist; store sightings in plugin storage collections.
- **Sightings keyed by canonical URL; links keyed (article, sighting).** Rationale: dedupe across polls; first-seen ordering is a plain timestamp sort; verification lives on the link so the same sighting can differ per story.
- **MapLibre GL + `pmtiles` JS client reading a single `.pmtiles` from R2 (local `/public` fallback).** Rationale: Protomaps-recommended stack, range-request efficient, no tile server to run. Alternative Leaflet — rejected: weaker vector styling for the brutalist treatment.
- **Graph overlay as GeoJSON source layers (nodes/edges) derived from co-linkage.** Rationale: no new tile pipeline; edges recompute from plugin API at request time. Hover via MapLibre popup; weather/census as small server adapters returning JSON, omitted on failure.
- **Brutalist map style: paper background, black 3px linework, monospace labels, single accent for first-published/verified.** Rationale: matches house style; legibility via minimum label sizes and node spacing.
- **Logo as `src/assets/thatsthe-news-logo.svg` inlined in masthead.** Rationale: crisp at all sizes, no extra request, black/red palette already matches theme. Fonts: `@font-face` blocks served from `src/assets/fonts/` with `font-display: swap` and preloads.

## Risks / Trade-offs

- [MediaCloud key absent] → registry sync and polling stay disabled with admin notice; seeded sample sources still render.
- [Feed hosts block server polling] → per-source backoff + logged failure; existing sightings preserved.
- [PMTiles large download on slow networks] → local fallback is a small metro extract for review; production full archive URL configured at deploy.
- [Overlay APIs rate-limit] → adapters cache briefly in KV; hover works without overlays.
- [Native plugin trust] → in-process code reviewed; no secrets logged; host allowlist enforced even natively via `ctx.http`.
- [Scope creep into other ten plugins] → hard boundary: Gather exposes feed + verification + graph APIs others will consume; no Rundown/Vibe logic here.

## Migration Plan

1. Land plan artifacts (this change) on `sandbox`, validated.
2. Implement in commit-per-component-group batches, pushing each: plugin core → API → admin UI → public feed components → map → brand.
3. `npm run typecheck` + `npm run build` + route curl checks per batch; `openspec validate gather --strict` before final commit.
4. Rollback: remove plugin from `astro.config.mjs` + drop component slots; site renders without feed/map (empty states).

## Open Questions

None that change specs, approach, or tasks. Overlay provider picks (which weather/census endpoints) are deferred to implementation adapters behind the interface.
