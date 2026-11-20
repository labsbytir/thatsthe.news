# Spec Delta

## Purpose

Credits the humans behind every update and gives each reporter a page showing everything attached to them in the dataset.

## ADDED Requirements

### Requirement: Reporter credits on updates
Updates SHALL credit reporters as "Journalist / Reporter @ [Publisher]" with photo when available, initials otherwise; multiple reporters render as an avatar stack with hover cards.

#### Scenario: Stack with hover cards
- **WHEN** an update has two reporters
- **THEN** both avatars show and each reveals a hover card with name, role, and publisher

### Requirement: Reporter pages
The system SHALL serve `/reporters/[id]` listing that reporter's updates, articles, and sightings newest-first, hiding empty sections.

#### Scenario: Reporter aggregation
- **WHEN** a reader visits a reporter's page
- **THEN** they see that reporter's updates, articles, and sightings with empty sections hidden
