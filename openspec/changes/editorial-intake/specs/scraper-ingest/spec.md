# Spec Delta

## Purpose

Gives external scrapers a stable authenticated contract for pushing raw material into the editorial layer with dedupe and desk attribution.

## ADDED Requirements

### Requirement: Authenticated ingest route
The system SHALL expose a private POST ingest route accepting a validated payload (canonicalUrl, source, title, body, publishedAt), authorized by a bearer secret compared in constant time, capped at 1 MiB.

#### Scenario: Invalid token writes nothing
- **WHEN** a request arrives with a missing or wrong token
- **THEN** the system rejects it without writing any record

### Requirement: Dedupe on canonical URL
Ingest SHALL normalize the URL with the existing canonicalizer and reuse the existing sighting when already seen, reporting `deduped: true`.

#### Scenario: Repeat payload dedupes
- **WHEN** a scraper posts an already-seen canonical URL
- **THEN** the response reports `deduped: true` with existing ids and no duplicate is stored

### Requirement: Draft creation with desk credit
Ingest SHALL link the sighting to a matching article or create a draft crediting "Newsk Run by tir labs".

#### Scenario: New story creates a draft
- **WHEN** a payload arrives for an unseen URL with no matching article
- **THEN** a draft article is created with the desk credit
