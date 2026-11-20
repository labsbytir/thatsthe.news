# Spec Delta

## Purpose

Renders a brutalist but legible PMTiles map showing how monitored sources relate, with hover details and optional weather and census overlays.

## ADDED Requirements

### Requirement: PMTiles basemap from R2
The system SHALL load the vector basemap from a PMTiles archive served over HTTP (R2 in production, local `/public` fallback for review) using range requests.

#### Scenario: Map loads from local fallback
- **WHEN** a visitor opens a page containing the source map in local review
- **THEN** basemap tiles render from the local PMTiles fallback without credentials

#### Scenario: Missing archive degrades gracefully
- **WHEN** the PMTiles archive URL is unreachable
- **THEN** the map shows an explicit unavailable state instead of a blank page

### Requirement: Source relationship graph overlay
The system SHALL draw monitored sources as nodes and their co-coverage relationships as edges on top of the basemap.

#### Scenario: Related sources are connected
- **WHEN** two sources have sightings linked to the same article
- **THEN** the map shows both nodes with an edge between them

#### Scenario: Isolated source has no edges
- **WHEN** a source shares no article with any other source
- **THEN** the map shows its node with no edges

### Requirement: Hover detail with overlays
The system SHALL show a hover panel per node with source detail plus pluggable overlay data (weather conditions, census context) where adapters provide it.

#### Scenario: Hover shows source and overlays
- **WHEN** a visitor hovers a source node and both adapters return data
- **THEN** the panel shows the source name, weather summary, and census summary

#### Scenario: Overlay outage does not break hover
- **WHEN** an overlay adapter fails or returns nothing
- **THEN** the hover panel still shows the source detail with the missing overlay omitted

### Requirement: Brutalist legible style
The system SHALL style the map brutally (heavy black rules, paper background, monospace labels, single accent) while keeping labels legible at desktop and phone widths.

#### Scenario: Narrow viewport stays usable
- **WHEN** a reviewer opens the map at phone width
- **THEN** nodes remain tappable, labels remain readable, and no page-level horizontal overflow occurs
