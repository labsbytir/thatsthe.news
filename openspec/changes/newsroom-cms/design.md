# Design

## Context

See `proposal.md` for motivation. The repo contains only a README tagline and license. Node.js v24 is available; npm is the package manager (pnpm is not installed). OpenSpec CLI v2 is available. The remote is `labsbytir/thatsthe.news`; work lands on a `sandbox` branch with one commit per logical change.

## Goals / Non-Goals

**Goals:**

- A locally runnable Astro + EmDash site whose public pages read published content at request time.
- A first schema small enough to reason about but complete enough for a newsroom: articles, breaking flag, region, categories, tags, bylines, site title/tagline.
- A distinct brutalist Vox/Wired-inspired design, implemented in the site's own CSS rather than a generic CMS theme.

**Non-Goals:**

- Cloudflare/D1/R2 deployment, custom domains, or credentials of any kind.
- Automated ingestion, realtime feeds, geolocation, or RSS in this change (the tagline is aspirational; the editable site is the deliverable).
- Comments, search, newsletters, ads, i18n, or a full design system.

## Decisions

- **Scaffold from `npm create emdash@latest` with the Node.js Starter, then transplant into the repo root.** The repo already has a git history and license; scaffolding into a temp directory and copying files in avoids overwriting those. Alternative: scaffold in place — rejected because the scaffolder expects an empty directory and would risk clobbering `.git` and `.opencode`.
- **SQLite + local media storage.** The Starter's zero-cloud path; no account, no secrets beyond the generated local encryption key. Alternative: Cloudflare template — rejected because it needs cloud resources before local review.
- **Keep the seed as the source of truth for the schema and sample content.** `seed/seed.json` is small, reviewable, and applied by the setup wizard. Fields use documented types only: `string`, `text`, `portableText`, `image`, `boolean`, `select`. Taxonomies and bylines are seeded alongside articles.
- **Server output (`output: "server"`).** Required for "publish and reload" behavior in the preview; static output would freeze content at build time.
- **Pages use `getEmDashCollection()` / `getEmDashEntry()` and the `Image` and `PortableText` components from `emdash/ui`.** Avoids hand-rolling portable text rendering and media URLs.
- **Hand-written CSS in one global stylesheet.** A brutalist look is a handful of rules (heavy borders, monospace, uppercase display type, CSS grid); a component framework or Tailwind would add dependencies for no visual gain.

## Risks / Trade-offs

- [Scaffolder output may differ from docs] → read the generated files before editing; keep generated secrets and DB out of git.
- [Passkey registration needs a browser and the user] → the user registers their own passkey; never handle credentials.
- [Brutalist typography with no web fonts] → use system font stacks (monospace + condensed sans); no external font dependency or layout shift.
- [Sample articles use remote images] → if seeding images fails offline, render text-only cards with a strong typographic treatment.
- [All changes are local] → no deployment; database remains in the local dev environment.

## Migration Plan

1. Create `sandbox` branch.
2. Scaffold and transplant the site; commit scaffold.
3. Replace the starter seed with the newsroom seed; commit.
4. Replace the starter pages/styles with the newsroom pages and brutalist CSS; commit.
5. Run dev server, complete setup in the browser (user registers passkey), publish a test edit, verify public page.
6. Validate OpenSpec change and report review URLs. Rollback is `git checkout main` plus deleting untracked DB/env files.

## Open Questions

None that would change the specs or task breakdown. Visual refinements can be made during the local review pass.
