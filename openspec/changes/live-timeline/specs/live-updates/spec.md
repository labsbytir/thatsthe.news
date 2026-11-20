# Spec Delta

## Purpose

Turns breaking stories into live timelines where every update is linkable, shareable with its own preview, and delivered without a page reload.

## ADDED Requirements

### Requirement: Update collection keyed by article slug
The system SHALL store timeline updates in an `article_updates` collection keyed to articles by slug string, ordered pinned-first then newest-first, with corrections superseding without moving the original.

#### Scenario: Update appears in order
- **WHEN** an editor publishes an update
- **THEN** it appears in the article timeline in pinned/newest order on the next fetch

#### Scenario: Correction keeps position
- **WHEN** an editor issues a correction
- **THEN** the original keeps its position and URL with a Corrected badge

### Requirement: Deep links per update
Each update SHALL be reachable via fragment `#update-[id]` with highlight and via canonical `/articles/[slug]/updates/[id]` page linking back to the fragment.

#### Scenario: Fragment highlights without JS
- **WHEN** a reader opens the fragment URL with JS disabled
- **THEN** the page scrolls to the update and highlights it

### Requirement: Per-update social image
The update page's og:image SHALL be a dynamic PNG of that update's text with the site logo bottom-right, versioned by `updatedAt`, falling back to the article image on render failure.

#### Scenario: Crawler gets update preview
- **WHEN** a crawler fetches the update URL
- **THEN** og:image resolves to a PNG containing that update's text and logo

### Requirement: Realtime delivery with fallback
The system SHALL deliver new updates over SSE with a client script that prepends them live; without JS or SSE the server-rendered timeline and a reload affordance remain.

#### Scenario: Live prepend
- **WHEN** an update publishes while the page is open with SSE connected
- **THEN** it appears at the top of the timeline without reload
