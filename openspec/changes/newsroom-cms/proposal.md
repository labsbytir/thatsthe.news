# Proposal

## Why

`thatsthe.news` is an empty repo with only a tagline: "automated news. around the clock. updated in realtime where you are." There is no site and no way to manage editorial content. We need a working news-agency site now, with a real content model, so the team can write and publish stories and review the result locally before any deployment decision.

## What Changes

- Scaffold a new Astro + EmDash site in the repo root using the Node.js Starter (SQLite, local media, no cloud account).
- Define a small newsroom content model: `articles` collection with headline, dek, body, hero image, breaking flag, and region; `category` and `tag` taxonomies; bylines; editable site title and tagline.
- Seed a handful of realistic sample stories so the homepage is populated on first setup.
- Build server-rendered pages with a brutalist Vox/Wired-inspired design: homepage with a breaking-news strip, lead story and story grid; article detail pages; category archive.
- Run the dev server locally and verify that editing and publishing in the EmDash admin changes the public page on reload.
- No deployment, no cloud credentials, and no automation/API integration in this change.

## Capabilities

### New Capabilities

- `newsroom-content`: The editorial content model and authoring workflow — articles, taxonomies, bylines, and site branding that editors manage in EmDash.
- `public-news-site`: What visitors see — server-rendered homepage, article pages, and category archives in the brutalist house style, reading published EmDash content at request time.

### Modified Capabilities

- None. No existing specs.

## Impact

- New files: `astro.config.mjs`, `src/**`, `seed/seed.json`, `package.json`, `.env` (gitignored), `data.db` (gitignored).
- Existing `README.md` and `LICENSE` stay; README will gain local run/admin instructions.
- New runtime dependency: `emdash` with the Astro Node adapter; Node.js >= 22.23.4.
- Git: work lands on the `sandbox` branch, committed incrementally and pushed to `origin`.
