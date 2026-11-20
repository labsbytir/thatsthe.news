# Proposal

## Why

Anonymous reading doesn't sustain a newsroom relationship. Readers need accounts with portable identities, visible history they control (including full reset), expressive actions on stories, and newsletters driven by what they actually read — all with a stated privacy posture.

## What Changes

- Reader accounts: server-issued 12-digit Reader ID (crypto RNG, uniqueness-checked), HttpOnly cookie session (EmDash member auth if confirmed, else self-built cookie sessions — auth guide 404'd, fallback specced).
- Deterministic seeded-SVG algorithmic avatars (byte-identical per ID, zero deps/requests).
- Onboarding quiz writing weighted `reader_interests`; skippable.
- Reading history page, save/heart/share actions (public heart aggregates preserved across resets), and "reset my Reader ID" with defined purge semantics.
- Analytics: server-side visit rows with UTM capture behind a single `analytics.write()` seam (Node today, Workers Analytics Engine after a future adapter move; no Workers imports on Node).
- Newsletter plugin with a behavior interest engine (quiz + reads + hearts/saves, weekly decay) and trigger/cap/unsubscribe rules.

## Capabilities

### New Capabilities

- `reader-identity`: Signup, 12-digit IDs, algorithmic avatars, reset purge, quiz.
- `reader-library`: History, save/heart/share with public aggregates.
- `site-analytics`: Visit + UTM capture behind an adapter seam.
- `interest-newsletters`: Behavior interest engine and digest rules.

### Modified Capabilities

- None.

## Impact

- New plugin(s) for readers + newsletters (storage: readers, interests, reads, hearts, saves, visits, prefs); new routes (`/my/history`, account, quiz, actions), article page action buttons.
- Privacy: stored-data list + 13-month rolling retention for reads/visits, 90-day newsletter logs; logged-out readers get full reading + generic signup only.
