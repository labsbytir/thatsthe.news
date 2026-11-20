# Design

## Context

See proposal.md. Source: bonus ideas from the provenance, live, readers, and monetization research agents (sessions ses_e0815d081ffeFsDlIjCt1jTSkM, ses_e0815d07fffeoMc8V08Da4fJuq, ses_e0815d07cffez1wxCVv1Phkf1b, ses_e0815d07bffe9A3LrgBDGLV26b).

## Goals / Non-Goals

**Goals:** Ordered, attributed backlog with promotion criteria.
**Non-Goals:** Building anything; freezing designs prematurely.

## Decisions

- **Order by dependency, not excitement:** verify.json + first-seen line first (extend shipped provenance), then engagement loops (streaks, follow-story), then revenue amplifiers (thermometer, round-up, API dashboard), then platform moves (Cloudflare cutover, merge, topic unsubscribe).
- **Promotion rule:** an item graduates when it gets a requesting user decision plus a dedicated change; bonus text is a seed, not a spec.

## Risks / Trade-offs

- [Backlog rot] → Mitigation: review each planning session; drop stale items rather than carrying them.

## Migration Plan

Not applicable — no code.

## Open Questions

None — questions live with the future changes.
