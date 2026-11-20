# Tasks

## 1. Provenance core

- [ ] 1.1 Add `provenance_hash` indexed string field to the `articles` seed and verify `npx emdash seed seed/seed.json --validate` passes
- [ ] 1.2 Implement canonical serializer + SHA-256 hashing with stable key order and verify the unit test shows changed whitespace-only input keeps the same hash while changed body text changes it
- [ ] 1.3 Implement `revisions` storage and append-on-publish hooks (skip on no-change, compareAndSet head) and verify a no-change save writes no revision
- [ ] 1.4 Render the verification badge on the article page from the stored hash and verify the badge shows truncated hash + revision
- [ ] 1.5 Implement OTS submit/confirm flow with pending state and retry cron and verify a calendar outage still publishes with anchor-pending marked
- [ ] 1.6 Add `content:write` capability and `verify.json` endpoint and verify it returns hash, rev, prev, and proof fields

## 2. Ingest and machine readability

- [ ] 2.1 Implement private `ingest` route (bearer check, 1 MiB cap, zod validation) and verify invalid token writes nothing
- [ ] 2.2 Implement dedupe + draft creation with "Newsk Run by tir labs" credit and verify a repeat payload returns `deduped: true` with no duplicate
- [ ] 2.3 Implement dynamic `/articles/[slug]/llms.txt` and verify it 404s for drafts and reflects edits on next request
- [ ] 2.4 Implement dynamic `/sitemap.xml` with publish-triggered cache purge and verify a new publish appears on next fetch
- [ ] 2.5 Document the ingest contract in `plugins/gather/README.md` and verify the documented example payload validates
- [ ] 2.6 Run `npm run typecheck` and `npm run build`, verify route curls, then run `openspec validate editorial-intake --strict` and verify it passes

## Workflow follow-up

- Confirm the `ctx.content` draft-create path against the EmDash API before implementing task 2.2.
- Build premium-fund accounting only after legal review (see monetization change).
