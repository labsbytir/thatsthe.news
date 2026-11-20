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

### Requirement: Deferred R2 font
The system SHALL load the custom font from R2 only when the user has uploaded it and configured its URL, using the system stack otherwise.

#### Scenario: No font URL uses system stack
- **WHEN** no font URL is configured
- **THEN** the site renders with the existing system font stack and no failed requests

#### Scenario: Configured font URL is used
- **WHEN** a font URL is configured
- **THEN** the site loads it via font-display swap without blocking text rendering
