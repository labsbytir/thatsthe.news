# Spec Delta

## Purpose

PHASE 2 ONLY — defines how contributing journalists are paid per view from a shared pool. Requirements are frozen now; implementation is explicitly deferred until payout and legal review pass.

## ADDED Requirements

### Requirement: Attributable views (Phase 2, deferred)
The system SHALL count one attributable view per session per article per 24h attributed to bylined contributors. NOT BUILT in this change.

#### Scenario: Dedupe window holds
- **WHEN** a session renders the same article twice in 24h
- **THEN** exactly one attributable view is logged

### Requirement: Anti-gaming quarantine (Phase 2, deferred)
Views exceeding velocity thresholds SHALL be quarantined for review and excluded from payouts until cleared. NOT BUILT in this change.

#### Scenario: Spike is quarantined
- **WHEN** views exceed the velocity threshold
- **THEN** they are excluded from payout calculation pending review

### Requirement: Payout ledger (Phase 2, deferred)
Monthly pool shares SHALL split pro-rata by attributable views into frozen immutable rows with public aggregates and threshold rollover. NOT BUILT in this change.

#### Scenario: Period freeze
- **WHEN** a payout period closes
- **THEN** ledger rows freeze and journalist statements are viewable
