# Spec Delta

## Purpose

Gives every reader a portable, resettable identity with a deterministic avatar and a preference profile seeded by an onboarding quiz.

## ADDED Requirements

### Requirement: 12-digit Reader IDs
Signup SHALL issue exactly one server-generated 12-digit ID (crypto RNG, uniqueness-checked, never sequential) bound via HttpOnly cookie session, using EmDash member auth when confirmed or self-built cookie sessions otherwise.

#### Scenario: Signup issues one ID
- **WHEN** a new reader signs up
- **THEN** the server issues exactly one 12-digit ID and sets the session cookie, regenerating on collision

### Requirement: Algorithmic avatars
Profiles without a custom avatar SHALL render a deterministic seeded SVG derived from the Reader ID, byte-identical across renders with no external request.

#### Scenario: Deterministic avatar
- **WHEN** a profile renders twice for the same ID
- **THEN** both SVG outputs are byte-identical

### Requirement: Quiz seeds interests
The onboarding quiz SHALL write one weighted interest row per picked topic (skippable, empty profile falls back to editorial defaults).

#### Scenario: Quiz builds profile
- **WHEN** a reader completes the quiz
- **THEN** their profile holds one row per picked topic

### Requirement: Reset purges the association
Reset SHALL delete reads, hearts, saves, and interests for the old ID, rotate the avatar seed, invalidate old sessions, issue a new ID, and leave public heart aggregates unchanged.

#### Scenario: Reset purges and reissues
- **WHEN** a reader confirms reset
- **THEN** old-ID rows are unqueryable, the session maps to the new ID, and public heart counts are unchanged
