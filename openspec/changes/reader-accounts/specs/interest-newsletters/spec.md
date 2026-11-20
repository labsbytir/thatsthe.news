# Spec Delta

## Purpose

Sends each reader a digest driven by demonstrated interest — quiz, reads, hearts, saves — with strict frequency caps and one-click exit.

## ADDED Requirements

### Requirement: Interest-weighted profiles
Profiles SHALL combine quiz picks (1.0) with reads (+0.2 capped), hearts/saves (+0.5), decayed weekly; reset clears the profile.

#### Scenario: Behavior shifts the profile
- **WHEN** a reader hearts several technology stories
- **THEN** technology weight rises and appears in the next eligible digest

### Requirement: Trigger, cap, unsubscribe
An issue SHALL queue when 3+ unread high-interest articles accumulate or the weekly schedule fires, at most one issue per reader per 7 days; unsubscribe stops sends while history/hearts keep working.

#### Scenario: Cap holds under trigger
- **WHEN** the trigger fires twice within 7 days
- **THEN** exactly one issue is queued

#### Scenario: Unsubscribe stops sends
- **WHEN** a reader unsubscribes
- **THEN** no further issues queue while other features keep working
