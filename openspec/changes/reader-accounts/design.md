# Design

## Context

See proposal.md. Site is Astro SSR on the Node adapter; article pages server-render. Supervision correction: EmDash member-auth unconfirmed (guide 404'd), so cookie sessions are specced as the fallback, not an afterthought.

## Goals / Non-Goals

**Goals:** Portable identity, reader-controlled data, honest aggregates, swappable analytics, interest-driven mail.
**Non-Goals:** Passwords in v1 (cookie sessions), ESP choice (open), fraud-proof hearts in v1 (rate-limit toggles best-effort).

## Decisions

- **Self-built cookie sessions as the baseline, EmDash member auth adopted if confirmed.** Rationale: unblocks v1 without guessing EmDash internals; swap is a session-resolution change only.
- **Seeded inline SVG avatars (mulberry32 over ID digits).** Rationale: zero deps/requests/storage, deterministic for tests.
- **Aggregates as anonymized counters separate from per-reader rows.** Rationale: reset purge can't move public counts; fraud work later touches counters only.
- **`analytics.write()` seam with Node (table) and Workers (Analytics Engine) backends.** Rationale: one-line migration when the adapter changes; enforced by a build check for Workers imports.
- **Engine: linear weights + weekly decay; trigger = 3+ unread high-interest OR weekly cron; cap 1/7d.** Rationale: explainable, testable, no ML ops. Unsubscribe stops sends, keeps account.

## Risks / Trade-offs

- [Auth rework if EmDash provides member auth] → session resolution isolated behind one function.
- [UTM + logged-out visits vs cookie policy] → policy decision required before enabling logged-out capture.
- [ESP unknown] → transport behind an interface; pick Resend/Postmark/Cloudflare Email at build.

## Migration Plan

1. Readers plugin (identity, library), analytics seam, newsletter plugin + engine.
2. Quiz UI, history page, action buttons, purge flow; typecheck/build/curls; validate --strict.
3. Rollback: disable plugin; articles render unchanged.

## Open Questions

1. EmDash member auth: exists or self-built sessions?
2. ESP choice (dictates plugin shape)?
3. Logged-out UTM capture acceptable under cookie policy?
4. Fraud-resistant hearts in v1 or best-effort?
