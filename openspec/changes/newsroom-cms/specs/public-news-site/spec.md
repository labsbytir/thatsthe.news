# Spec Delta

## Purpose

Presents published newsroom content to visitors as a fast, server-rendered news site with a brutalist visual identity, so a publication can be reviewed and evaluated before deployment.

## ADDED Requirements

### Requirement: Runtime content rendering
The system SHALL render public pages at request time from published EmDash content so that a publication is visible on the next page load without a rebuild.

#### Scenario: Publishing updates the homepage
- **WHEN** an editor publishes a new article and a visitor reloads the homepage
- **THEN** the homepage lists the newly published article

### Requirement: Homepage composition
The homepage SHALL show the site branding, a breaking-news strip for articles flagged as breaking, a lead story, and a reverse-chronological grid of other published articles.

#### Scenario: Breaking story is highlighted
- **WHEN** at least one published article is flagged as breaking
- **THEN** the homepage renders those headlines in the breaking-news strip above the lead story

#### Scenario: No breaking stories
- **WHEN** no published article is flagged as breaking
- **THEN** the homepage renders without a breaking-news strip and still shows the lead story and grid

### Requirement: Article detail page
The system SHALL serve each published article at a stable slug URL with its headline, dek, byline, publication date, category, region, hero image, and body.

#### Scenario: Visitor opens an article
- **WHEN** a visitor opens the URL of a published article
- **THEN** the page shows the article's headline, dek, byline, date, category, region, hero image when present, and Portable Text body

#### Scenario: Unknown article slug
- **WHEN** a visitor opens a URL with no matching published article
- **THEN** the system returns a not-found response

### Requirement: Category archive
The system SHALL serve an archive page per category listing published articles assigned to that category.

#### Scenario: Visitor opens a category
- **WHEN** a visitor opens a category archive URL
- **THEN** the page lists only published articles assigned to that category

### Requirement: Brutalist house style
The public site SHALL use a deliberate brutalist visual system: heavy black rules, high-contrast black-and-white surfaces with a single accent color, oversized uppercase display type, monospace metadata, and an asymmetric grid.

#### Scenario: Homepage is visually reviewed
- **WHEN** a reviewer opens the homepage on a desktop viewport
- **THEN** the page shows heavy borders, oversized uppercase headlines, monospace metadata, and an asymmetric lead-story grid

#### Scenario: Narrow viewport
- **WHEN** a reviewer opens the same page on a phone-width viewport
- **THEN** the grid collapses to a single readable column without horizontal overflow

### Requirement: Local preview endpoints
The system SHALL serve the public site and the EmDash admin on the local development server without cloud credentials.

#### Scenario: Local review
- **WHEN** the developer runs the project's dev command
- **THEN** the public site and `/_emdash/admin/` are both reachable on localhost
