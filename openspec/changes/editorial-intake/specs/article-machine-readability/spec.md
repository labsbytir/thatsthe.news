# Spec Delta

## Purpose

Makes every article machine-readable for AI clients and search engines through live-generated llms.txt and sitemap responses.

## ADDED Requirements

### Requirement: Per-article llms.txt
The system SHALL serve `/articles/[slug]/llms.txt` rendered live from the published entry (title, dek, canonical URL, hash, dates, plain-text body), returning 404 for drafts and unpublished articles.

#### Scenario: Update reflects immediately
- **WHEN** an article is updated and published
- **THEN** its llms.txt reflects the change on the next request with no extra write step

### Requirement: Dynamic sitemap
The system SHALL serve `/sitemap.xml` listing published articles (with `updatedAt` as lastmod) plus static pages, paginating via an index when the collection exceeds one file.

#### Scenario: Publish appears in sitemap
- **WHEN** an article is published
- **THEN** the next sitemap fetch includes its URL
