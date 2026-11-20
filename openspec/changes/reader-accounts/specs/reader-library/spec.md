# Spec Delta

## Purpose

Lets logged-in readers keep history, save and heart stories, and share them, while public aggregates stay honest.

## ADDED Requirements

### Requirement: Reading history
Logged-in article views SHALL record debounced read rows visible on a reverse-chronological history page; logged-out views record nothing.

#### Scenario: Logged-in read is recorded
- **WHEN** a logged-in reader opens an article
- **THEN** a read row is recorded within 60 seconds

### Requirement: Save, heart, share
Hearts SHALL be one-per-reader toggles driving a cached public aggregate; saves are per-reader; share uses native share with clipboard fallback and UTM-tagged URLs. Logged-out actions prompt signup.

#### Scenario: Heart toggles aggregate
- **WHEN** a logged-in reader hearts then un-hearts
- **THEN** the public count increments then decrements by exactly one each way
