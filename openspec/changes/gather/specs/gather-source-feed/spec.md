# Spec Delta

## Purpose

Continuously monitors live news sources and attaches a shared, verifiable source feed to each article so readers see who published first and what is verified.

## ADDED Requirements

### Requirement: Source registry seeded from MediaCloud
The system SHALL maintain a source registry seeded from the MediaCloud v4 directory/API (collections, sources, feeds) that editors can review in the admin.

#### Scenario: Registry lists seeded sources
- **WHEN** the Gather plugin completes a directory sync
- **THEN** the admin source list shows each source with its collection, homepage, and feed URL

#### Scenario: Registry sync is repeatable
- **WHEN** a directory sync runs twice with the same upstream data
- **THEN** no duplicate source records are created

### Requirement: Continuous feed polling
The system SHALL poll registered RSS/sitemap feeds on a schedule and record sightings with first-seen timestamps.

#### Scenario: New story creates a sighting
- **WHEN** a poll finds a story URL not previously recorded for a source
- **THEN** a sighting is stored with the source, URL, title, and first-seen time

#### Scenario: Poll failure does not lose state
- **WHEN** a feed fetch fails transiently
- **THEN** existing sightings are preserved and the failure is logged with the source

### Requirement: Per-article shared source feed
The system SHALL expose a per-article source feed listing linked sightings ordered by first-seen time, with the earliest clearly marked as first-published.

#### Scenario: Feed shows first-published
- **WHEN** a visitor opens an article with two or more linked sightings
- **THEN** the feed lists them oldest-first and marks the earliest as first-published

#### Scenario: Empty feed state
- **WHEN** a visitor opens an article with no linked sightings
- **THEN** the feed renders an explicit empty state instead of failing

### Requirement: Verification states
The system SHALL carry a verification state per sighting link (unverified, corroborated, verified, disputed) that editors can set and visitors can see.

#### Scenario: Editor verifies a sighting
- **WHEN** an editor marks a linked sighting as verified
- **THEN** the public feed shows the verified badge for that entry on the next request

#### Scenario: Disputed sighting is visible
- **WHEN** a linked sighting is marked disputed
- **THEN** the public feed shows the disputed badge and keeps the entry listed

### Requirement: Citations output
The system SHALL render machine-readable citations for each feed entry (source name, story title, URL, first-seen time) usable by story templates.

#### Scenario: Citations render
- **WHEN** a visitor opens an article with linked sightings
- **THEN** each entry exposes source name, title, URL, and first-seen time for citation display
