# Design

## Context

See proposal.md. Reuses the Gather native plugin pattern; key-gated endpoints proxy Gather stores. Supervision stance: provider is a recommendation, fund custody is load-bearing and unresolved, premium fund is spec-only.

## Goals / Non-Goals

**Goals:** Standalone shippable donations, subs, and keys; frozen Phase-2 fund design.
**Non-Goals:** Provider SDK wiring, paywalls on articles, building the premium fund now.

## Decisions

- **Donations → subscriptions → keys sequencing.** Rationale: each ship has no dependency on later ones; keys require subs (active check).
- **Stripe-shaped provider recommendation, undecided.** Rationale: Payment Links + webhooks fit without card storage; OpenCollective stays open for strike-fund deplatforming risk. No code depends on the pick (webhook adapter interface).
- **Status in plugin storage keyed by reader id, resolved per-request.** Rationale: single source of truth beside Reader IDs.
- **Quota 20/day/key, UTC-day window, headers on every gated response.** Rationale: simplest auditable window; sliding windows add gaming surface.
- **Premium fund frozen as requirements.** Rationale: payout math depends on legal review; building now risks rework.

## Risks / Trade-offs

- [Fund custody/legal] → can reshape donation + payout accounting; confirm before building payout paths.
- [Subscriber identity source] → EmDash users vs external auth undecided; key ownership follows it.

## Migration Plan

1. Donations ship, then subs, then keys; premium fund untouched.
2. Webhook handling idempotent; typecheck/build/curls; validate --strict.
3. Rollback per ship: disable routes; ledger rows retained.

## Open Questions

1. Fund holder + tax/1099 implications?
2. Stripe confirmed or alternative required?
3. Subscriber identity source and key ownership?
4. Premium pool formula: fixed % vs discretionary?
