# Spec Delta

## Purpose

Funds a transparent mutual-aid and strike-ready safety net for news workers through public donations with an auditable ledger.

## ADDED Requirements

### Requirement: Donate flow
Donors SHALL give one-time or monthly pledges at preset or custom amounts with public/anonymous toggle and a receipt; confirmed donations increment public totals within one cycle.

#### Scenario: Confirmed donation updates totals
- **WHEN** a donation confirms via provider webhook
- **THEN** public raised totals increment within one poll cycle

### Requirement: Aid requests with strike fast track
Workers SHALL request aid (amount, category, statement) through triage states to paid; strike/hardship flags enter an expedited queue requiring two-admin approval.

#### Scenario: Strike request is expedited
- **WHEN** a request is flagged strike/hardship
- **THEN** it appears in the expedited queue requiring two approvals
