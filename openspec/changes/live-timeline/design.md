# Design

## Context

See proposal.md. Article page server-renders via `getEmDashEntry`; bylines exist as `article.data.bylines[]`. Supervision correction: cross-collection reverse lookup unconfirmed, so updates key by article slug string with an indexed field.

## Goals / Non-Goals

**Goals:** Live feel on static-friendly infra, shareable updates, credited reporters.
**Non-Goals:** Websockets, polling loops, pre-generated OG PNGs in the Media Library, auth model for who may publish updates.

## Decisions

- **`article_updates` EmDash collection (not plugin storage, not PT blocks).** Rationale: editors, edit history, SEO, and reuse for reporter/OG routes come free; plugin storage is invisible to editors and PT blocks can't be deep-linked or credited.
- **Slug-string key + indexed query, not reference reverse lookup.** Rationale: works regardless of EmDash reference capabilities; fallback-safe.
- **Satori + resvg OG route, cached immutable per `updatedAt`, `?v=` bump on edit.** Rationale: pure npm, no browser/service; brutalist styling reuses theme tokens; logo SVG composited bottom-right per requirement.
- **SSE `events` endpoint emitting update/correction with id + updatedAt; ~30-line EventSource script prepending/patching `<article id="update-[id]">` nodes.** Rationale: lowest infra; polling rejected as wasteful, websockets as overkill. Title flash "(1 new)" on arrival.
- **Avatar stack with CSS `:hover`/`:focus-within` hover cards.** Rationale: works without JS, accessible by keyboard.

## Risks / Trade-offs

- [SSE fan-out on Node adapter] → cache + retry backoff; cap concurrent connections per article.
- ["Live" definition] → explicit `isLive` flag on articles drives badges/masthead; updates alone don't imply live.
- [OG render cost] → aggressive immutable caching; article OG untouched by update edits.

## Migration Plan

1. Seed collection, build routes (timeline slot, update page, og.png, events), reporter pages, client script.
2. Typecheck, build, curl OG + SSE + fragment checks, validate --strict.
3. Rollback: hide timeline slot; articles render as today.

## Open Questions

1. Reference vs slug-string key — confirm EmDash reverse-lookup support at implementation.
2. Reporter profiles: extend bylines or new `reporters` collection with photo + publisher?
3. `isLive` flag vs update-count heuristic?
4. Webhook fan-out source for SSE, or poll EmDash inside the endpoint?
