# Tasks

## 1. Scaffold the local site

- [x] 1.1 Create the `sandbox` branch and initialize OpenSpec; verify `openspec status --change newsroom-cms` reports the change
- [x] 1.2 Scaffold the EmDash Node.js Starter into a temp directory with npm and copy its files into the repo root without overwriting `.git`, `.opencode`, `README.md`, or `LICENSE`; verify `package.json`, `astro.config.mjs`, and `seed/seed.json` exist
- [x] 1.3 Confirm `.gitignore` excludes `.env` and the local SQLite database; verify with `git status --short` that no secrets or DB files are staged
- [x] 1.4 Commit the scaffold on `sandbox` and push to origin; verify the commit appears on the remote branch

## 2. Model the newsroom content

- [x] 2.1 Replace `seed/seed.json` with the newsroom model: `articles` collection (headline, dek, body, hero image, breaking flag, region), `category` and `tag` taxonomies, a byline, and site title/tagline; verify `npx emdash seed seed/seed.json --validate` passes
- [x] 2.2 Add at least three published sample articles with distinct headlines, categories, regions, and one breaking story; verify the seed still validates and sample slugs are unique
- [x] 2.3 Update `README.md` with local run and admin setup instructions; verify the commands are copy-pasteable
- [x] 2.4 Commit and push the content model; verify the remote branch advanced

## 3. Build the public site

- [x] 3.1 Create a shared layout with site branding from EmDash settings and the brutalist global stylesheet; verify the stylesheet is imported by the layout
- [x] 3.2 Build the homepage with breaking strip, lead story, and reverse-chronological grid using `getEmDashCollection("articles")`; verify the query orders by `published_at` descending
- [x] 3.3 Build `/articles/[slug]` using `getEmDashEntry`, `Image`, and `PortableText`, with a 404 for missing entries; verify the route renders headline, dek, byline, date, category, region, image, and body
- [x] 3.4 Build `/category/[slug]` using `getTaxonomyTermsWithCacheHint` and a filtered collection query; verify only matching published articles appear
- [x] 3.5 Add a responsive collapse so the asymmetric grid becomes one column on narrow viewports; verify no horizontal overflow at phone width
- [x] 3.6 Run `npm run typecheck` and `npm run build` and fix errors; verify a successful build with zero type errors
- [x] 3.7 Commit and push the site implementation; verify the remote branch advanced

## 4. Verify locally and hand back

- [x] 4.1 Start `npm run dev`; verify the public site returns HTTP 200 on localhost (port 4322 — port 4321 is occupied by another process)
- [ ] 4.2 User completes the admin setup wizard and registers their own passkey; verify the dashboard opens and sample articles are listed
- [ ] 4.3 Verify publish flow by having the user edit and publish an article title, then reload the public page and confirm the change; report if any step fails
- [x] 4.4 Run `openspec validate newsroom-cms --strict`; verify validation passes before the final commit
- [ ] 4.5 Commit and push any final fixes; report local site URL, admin URL, what is editable, and what is not working yet
