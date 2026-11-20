# Spec Delta

## Purpose

Proves what was published and when through canonical content hashes and an optional Bitcoin-anchored timestamp, without ever blocking editorial flow.

## ADDED Requirements

### Requirement: Canonical hash on publish
The system SHALL compute a SHA-256 hash over canonical article content (headline, dek, body blocks, hero image id, byline ids, publishedAt) and append a revision `{ rev, hash, prev, actor, at }` when published content differs from the chain head.

#### Scenario: Publish appends a revision
- **WHEN** an editor publishes an article whose content differs from the chain head
- **THEN** a new revision links `prev` to the prior hash

#### Scenario: No-change save writes nothing
- **WHEN** an editor saves without changing canonical content
- **THEN** no new revision is written

### Requirement: Verification badge
The system SHALL display the stored current hash and revision on the article page, and a public `verify.json` endpoint SHALL return the full chain for third-party checking.

#### Scenario: Badge shows current revision
- **WHEN** a visitor opens a published article
- **THEN** the badge shows a truncated current hash and revision number

#### Scenario: Third-party verification
- **WHEN** a client fetches the article's `verify.json`
- **THEN** it receives the hash, revision, predecessor, and anchor proof when present

### Requirement: Blockchain anchoring is enhancement-only
The system SHALL submit publish hashes to OpenTimestamps and record pending/confirmed anchor state, never failing a publish when the calendar is unreachable.

#### Scenario: Calendar outage does not block publishing
- **WHEN** the OTS calendar is unreachable at publish time
- **THEN** the article publishes, the revision is marked anchor-pending, and a cron retries

### Requirement: Desk credit on scraper-sourced articles
Articles created from scraper intake SHALL carry the byline "Newsk Run by tir labs".

#### Scenario: Ingested article shows desk credit
- **WHEN** a scraper payload creates a draft article
- **THEN** the draft credits "Newsk Run by tir labs"
