# Spec Delta

## Purpose

Sustains free access through $9.99 monthly subscriptions with graceful failure handling and no article paywall.

## ADDED Requirements

### Requirement: Subscribe, cancel, and past-due grace
Checkout SHALL activate subscriptions; cancel keeps access to period end with no prorata refund; failed payment sets past-due with 7-day grace and retry before suspension.

#### Scenario: Failed payment keeps grace access
- **WHEN** a payment fails
- **THEN** the subscriber keeps access for 7 days with a retry notice

### Requirement: No article paywall
Articles SHALL remain fully accessible to non-subscribers; gating applies only to API keys and member perks.

#### Scenario: Free article access
- **WHEN** a non-subscriber opens an article
- **THEN** they receive full access
