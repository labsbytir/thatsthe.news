# Spec Delta

## Purpose

Gives active subscribers self-serve API access with a strict daily quota and instant revocation.

## ADDED Requirements

### Requirement: Key lifecycle
Active subscribers SHALL create up to 5 keys (hash-stored, shown once) and revoke them instantly; revoked keys fail closed.

#### Scenario: Revoked key fails closed
- **WHEN** a key is revoked
- **THEN** its next call fails

### Requirement: 20 calls per day quota
Gated endpoints SHALL enforce 20 calls/day/key with `X-RateLimit-*` headers and 429 + `Retry-After` on excess.

#### Scenario: 21st call is rejected
- **WHEN** the 21st call arrives in the window
- **THEN** the system returns 429 with `Retry-After`

### Requirement: Key-gated Gather reads
Keys SHALL unlock `/api/v1/feed`, `/api/v1/sources`, `/api/v1/status` proxying Gather stores; `queue`/`verify` stay admin-only.

#### Scenario: Key reads proxied feed
- **WHEN** a valid key calls `/api/v1/sources`
- **THEN** it receives the Gather payload with quota headers
