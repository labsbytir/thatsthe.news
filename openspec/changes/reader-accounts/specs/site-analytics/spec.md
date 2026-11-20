# Spec Delta

## Purpose

Captures article visits and UTM attribution behind a single seam that migrates cleanly from the Node adapter to Cloudflare Workers.

## ADDED Requirements

### Requirement: Visit capture behind a seam
Article visits SHALL be written through one `analytics.write()` seam storing article, timestamp, UTM, referrer, and nullable reader id; Node builds MUST NOT import Workers-only APIs at module top level.

#### Scenario: UTM attribution stored
- **WHEN** an article URL with UTM params is visited
- **THEN** the visit row stores source, medium, and campaign

### Requirement: Cloudflare-ready migration
The seam SHALL have a Workers Analytics Engine implementation swappable in one adapter change, plus Web Analytics RUM via script tag.

#### Scenario: Node build stays clean
- **WHEN** the site builds on the Node adapter
- **THEN** no Workers-only import is evaluated
