# Proposal

## Why

thatsthe.news is the editorial layer: external scrapers push raw material in, editors curate and publish. Readers need proof of what was published and when, scrapers need a stable contract to push to, and every scraper-sourced story must carry the desk credit "Newsk Run by tir labs".

## What Changes

- New Gather capabilities: SHA-256 canonical content hash per article with a prev-linked revision chain (edits append revisions), public verification badge, optional OpenTimestamps (Bitcoin) anchoring as a non-blocking enhancement.
- New private `ingest` route accepting scraper payloads (bearer secret, 1 MiB cap, validated), deduping on canonical URL, linking or draft-creating articles credited to the desk byline.
- `articles` seed schema gains an indexed `provenance_hash` mirror field for the current hash.
- Machine readability: dynamic per-article `/articles/[slug]/llms.txt` and dynamic `/sitemap.xml`, both reading live entries (no build step).

## Capabilities

### New Capabilities

- `article-provenance`: Canonical hashing, revision chain, verification badge, OTS anchoring.
- `scraper-ingest`: Authenticated intake contract for external scrapers with dedupe and desk credit.
- `article-machine-readability`: Per-article llms.txt and dynamic sitemap.

### Modified Capabilities

- None.

## Impact

- `plugins/gather/` (storage: `revisions`; routes: `ingest`, `verify.json`; hooks: afterSave/afterPublish); needs `content:write` capability for draft creation.
- `seed/seed.json` (new `provenance_hash` field), `src/pages/articles/[slug].astro` (badge), new routes `llms.txt`, `sitemap.xml`, `verify.json`.
- External: scrapers adopt the ingest contract; OTS calendar (free, no keys).
