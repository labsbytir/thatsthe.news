# Spec Delta

## Purpose

Gives editors a small, explicit newsroom content model in EmDash so stories, credits, categories, and site branding can be authored, revised, and published without touching code.

## ADDED Requirements

### Requirement: Article content model
The system SHALL expose an `articles` collection whose entries carry a required headline, a short dek, a Portable Text body, an optional hero image, a breaking flag, and a region, plus category and tag taxonomy assignments and a byline credit.

#### Scenario: Editor opens a new article
- **WHEN** an editor opens the article editor in the EmDash admin
- **THEN** the editor offers fields for headline, dek, body, hero image, breaking flag, region, category, tag, and byline

#### Scenario: Required headline is missing
- **WHEN** an editor attempts to create an article with no headline
- **THEN** the system rejects the entry and identifies the headline as required

### Requirement: Editorial workflow
The system SHALL keep saved drafts private to the admin and preview flow until the editor publishes the change.

#### Scenario: Draft is not public
- **WHEN** an editor saves a draft revision of an existing published article
- **THEN** the public site continues to show the previously published revision

#### Scenario: Publication is public
- **WHEN** the editor publishes the pending change
- **THEN** the public site shows the new revision on the next request

### Requirement: Site branding is editable
The system SHALL expose the site title and tagline as EmDash site settings, editable from the admin without a code change.

#### Scenario: Editor changes the tagline
- **WHEN** an editor changes the site tagline in settings and publishes
- **THEN** the public site renders the new tagline

### Requirement: Sample content
The system SHALL seed a small set of published sample articles with categories, bylines, and regions so the site is populated immediately after first setup.

#### Scenario: First-time setup includes samples
- **WHEN** an administrator completes setup with sample content enabled
- **THEN** at least three published articles with distinct headlines are available to the public site
