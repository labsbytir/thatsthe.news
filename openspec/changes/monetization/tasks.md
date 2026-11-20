# Tasks

## 1. Donations

- [ ] 1.1 Implement donate flow (one-time + pledge, presets + custom, anon toggle, receipt) and verify a valid submission records a pending donation and shows a receipt
- [ ] 1.2 Implement public ledger totals + anonymized log and verify a confirmed donation increments totals within one cycle
- [ ] 1.3 Implement aid-request triage and strike fast track (two-admin approval) and verify a strike flag lands in the expedited queue
- [ ] 1.4 Confirm provider + fund custody answers before building payout paths and record the decision in design.md

## 2. Subscriptions and keys

- [ ] 2.1 Implement subscribe/cancel with period-end access and verify cancel keeps access until period end
- [ ] 2.2 Implement past-due 7-day grace with retry and verify access persists through grace
- [ ] 2.3 Verify non-subscribers keep full article access and key-gated APIs 403 without active subs
- [ ] 2.4 Implement key create (≤5, hash-stored, shown once) + revoke and verify revoked keys fail closed
- [ ] 2.5 Implement 20/day quota with headers and verify the 21st call returns 429 with Retry-After
- [ ] 2.6 Implement `/api/v1/*` proxies over Gather stores and verify payload parity with quota headers
- [ ] 2.7 Run `npm run typecheck` and `npm run build`, verify webhook + key curls, then run `openspec validate monetization --strict` and verify it passes

## Workflow follow-up

- Premium fund: spec frozen; build only after payout/legal review.
- Confirm subscriber identity source before 2.4.
