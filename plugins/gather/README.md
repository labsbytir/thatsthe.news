# Gather plugin

Native EmDash plugin. Continuous source monitoring with per-article shared
source feeds: first-published attribution, sightings, verification states,
and citations.

## Environment

| Variable | Purpose |
| --- | --- |
| `MEDIACLOUD_API_KEY` | MediaCloud v4 API key for directory sync. Without it, sync is skipped with a log notice and previously synced sources keep polling. |
| `PUBLIC_R2_FONT_URL` | (Site, not plugin) Custom font URL. Unrelated to Gather. |

No secrets are logged. The key is read from `process.env` (or the
`mediaCloudApiKey` plugin option) at sync time.

## Data

- `sources` — registry rows keyed by canonical domain (`uniqueIndexes: [domain]`).
- `sightings` — story sightings keyed by canonical URL (`uniqueIndexes: [canonicalUrl]`), first-seen preserved by `compareAndSet(..., null, ...)`.
- `links` — `(articleId, sightingId)` rows carrying the verification state.

## Schedules

- `gather-sync` — `5 */6 * * *`, MediaCloud directory → registry.
- `gather-poll` — `15 * * * *`, RSS/sitemap polling → sightings.

## Network

Declares `network:request` with no `allowedHosts`, which is unrestricted by
contract — required because the poller fetches arbitrary registered feed
hosts plus `search.mediacloud.org`.

## Routes

- `GET /_emdash/api/plugins/gather/feed?articleId=...` — oldest-first entries
  with `first` set on the earliest. Requires `content:read`.

## Checks

```bash
npm test        # node:test unit suite (no deps)
npm run typecheck
npm run build
```
