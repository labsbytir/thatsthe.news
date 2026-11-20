# Spec Delta

## Purpose

Applies the supplied "THAT'S THE NEWS" SVG wordmark as the site masthead logo and defers the custom font until the user uploads it to R2.

## ADDED Requirements

### Requirement: SVG wordmark in masthead
The system SHALL render the supplied SVG wordmark in the site masthead, linking to the homepage, with a text fallback when the asset is missing.

#### Scenario: Logo renders and links home
- **WHEN** a visitor opens the homepage with the logo asset present
- **THEN** the masthead shows the SVG wordmark linking to `/`

#### Scenario: Missing logo falls back to text
- **WHEN** the logo asset is absent
- **THEN** the masthead renders the site title as text instead of failing

### Requirement: Locally embedded house fonts
The system SHALL serve Vexorium Bold (display) and Montserrat variable (body) from local `src/assets/fonts/` via `@font-face` with `font-display: swap` and preloads, making zero external font requests.

#### Scenario: No external font requests
- **WHEN** a visitor loads any page
- **THEN** all font bytes come from the site's own assets and no third-party font request fires

#### Scenario: Missing font file falls back
- **WHEN** a font file is absent from the build
- **THEN** the site renders with the system font stack instead of failing
