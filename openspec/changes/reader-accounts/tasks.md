# Tasks

## 1. Identity and library

- [ ] 1.1 Implement signup issuing 12-digit IDs with collision retry and cookie sessions and verify a collision regenerates before responding
- [ ] 1.2 Implement seeded SVG avatars and verify byte-identical output for the same ID across renders
- [ ] 1.3 Build the quiz writing weighted interests and verify one row per picked topic, skippable to empty
- [ ] 1.4 Implement history logging + page and verify logged-out views write nothing
- [ ] 1.5 Implement save/heart/share with public aggregate and verify toggle moves the count by exactly one
- [ ] 1.6 Implement reset purge (rows deleted, sessions invalidated, new ID, aggregates unchanged) and verify old-ID rows are unqueryable

## 2. Analytics and newsletters

- [ ] 2.1 Implement `analytics.write()` seam with Node backend and UTM capture and verify a UTM visit stores source/medium/campaign
- [ ] 2.2 Verify the Node build imports no Workers-only API at module top level
- [ ] 2.3 Implement the interest engine (weights, decay, trigger, 1/7d cap, unsubscribe) and verify double-trigger queues exactly one issue
- [ ] 2.4 Select ESP behind the transport interface and document retention (reads/visits 13mo, logs 90d)
- [ ] 2.5 Run `npm run typecheck` and `npm run build`, verify action curls, then run `openspec validate reader-accounts --strict` and verify it passes

## Workflow follow-up

- Confirm EmDash member-auth story before building 1.1; confirm ESP before 2.4.
