# Design

## Context

See proposal.md. Gather plugin exists with storage/route/cron patterns to reuse. Corrections applied during supervision: no per-render hash recompute (display stored hash; verify via endpoint/hook), ingest draft creation needs `content:write`, `provenance_hash` comes via seed schema update.

## Goals / Non-Goals

**Goals:** Tamper-evident publishing, stable scraper contract, live machine-readable outputs.
**Non-Goals:** Wallet-based chains, build-time sitemap/llms files, scraper implementation itself (external).

## Decisions

- **SHA-256 over canonical JSON via WebCrypto, hex-encoded.** Rationale: runtime-native, no deps. Alternative (xxhash/object-hash) rejected: weaker ecosystem trust for provenance claims.
- **Revisions in plugin storage (`revisions`: index `articleId`, unique `[articleId, rev]`), head serialized by `compareAndSet` retry-once.** Rationale: chain queries never touch CMS tables. Mirror of current hash in `provenance_hash` seed field so list pages skip joins.
- **OpenTimestamps over EVM memo.** Rationale: free, no keys/gas ops, Bitcoin-anchored, verifiable via public calendar. OTS proof bytes stored on the revision record; badge upgrades on confirm. Publish never waits on it.
- **Dynamic routes for llms.txt/sitemap/verify.json reading live entries.** Rationale: zero editor steps, always current. Sitemap purges route cache on publish hooks.
- **Ingest: private POST, zod-validated, constant-time bearer check against settings secret, 1 MiB cap.** Rationale: matches existing route patterns; dedupe reuses `recordSighting` unique index.

## Risks / Trade-offs

- [`ctx.content` draft-create path unconfirmed] → verify against EmDash content-write API before implementation; fallback is sighting-only intake with manual article linking.
- [OTS calendar latency] → pending state + retry cron; badge shows local verification meanwhile.
- [Hash canonicalization drift] → canonical form versioned; old revisions verify against their recorded form version.

## Migration Plan

1. Add `provenance_hash` to seed, add `content:write`, ship storage/routes/hooks, add badge + machine routes.
2. Typecheck, build, route curls, `openspec validate editorial-intake --strict`.
3. Rollback: remove routes/badge; hashes remain inert data.

## Open Questions

1. Seed schema update path for `provenance_hash` on the live DB (migration vs re-seed)?
2. OTS proof storage: revision record blob vs media row?
3. Per-scraper keys vs one shared bearer secret?
4. Year-1 article volume for sitemap paging thresholds?
