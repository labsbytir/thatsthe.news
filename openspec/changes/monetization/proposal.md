# Proposal

## Why

Free access needs funding and news workers need a safety net. This change adds donations to a transparent mutual-aid/strike fund, $9.99 subscriptions that keep the site free, self-serve API keys for subscribers, and a frozen Phase-2 design for paying journalists per view — sequenced so each ship stands alone.

## What Changes

- Donations: one-time + monthly pledges, public ledger totals, aid-request triage (received → review → approved/denied → paid), strike-flag fast track with two-admin approval.
- Subscriptions $9.99/mo: checkout/cancel, 7-day past-due grace, no article paywall — gating applies to API keys and member perks only.
- API keys: ≤5 per subscriber, hash-stored, shown once, 20 calls/day with quota headers, instant revocation; key-gated `/api/v1/*` variants proxying Gather reads (queue/verify stay admin-only).
- Premium fund (PHASE 2, spec only): attributable views, anti-gaming quarantine, monthly pro-rata payout ledger, journalist profiles with threshold rollover. NOT built until payout/legal review passes.

## Capabilities

### New Capabilities

- `donation-fund`: Donate flow, transparent ledger, aid requests, strike fast track.
- `paid-subscriptions`: Checkout, status, grace, gating rules.
- `subscriber-api-keys`: Key lifecycle, 20/day quota, key-gated reads.
- `premium-fund`: Phase-2 per-view journalist payouts (requirements frozen, implementation deferred).

### Modified Capabilities

- None.

## Impact

- New plugin(s) reusing the Gather native pattern (storage/routes/cron/React admin); subscriptions keyed by reader id; API middleware resolving key → quota → subscriber.
- External: payment provider UNDECIDED (Stripe-shaped recommended); fund custody + tax treatment open and load-bearing for §§1/4.
