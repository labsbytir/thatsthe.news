# Tasks

## 1. Scaffold the local site

- [ ] 1.1 Create the `sandbox` branch and initialize OpenSpec; verify `openspec status --change newsroom-cms` reports the change
- [ ] 1.2 Scaffold the EmDash Node.js Starter into a temp directory with npm and copy its files into the repo root without overwriting `.git`, `.opencode`, `README.md`, or `LICENSE`; verify `package.json`, `astro.config.mjs`, and `seed/seed.json` exist
- [ ] 1.3 Confirm `.gitignore` excludes `.env` and the local SQLite database; verify with `git status --short` that no secrets or DB files are staged
- [ ] 1.4 Commit the scaffold on `sandbox` and push to origin; verify the commit appears on the remote branch

## 2. Model the newsroom content

- [ ] 2.1 Replace `seed/seed.json` with the newsroom model: `articles` collection (headline, dek, body, hero image, breaking flag, region), `category` and `tag` taxonomies, a byline, and site title/tagline; verify `npx emdash seed seed/seed.json --validate` passes
- [ ] 2.2 Add at least three published sample articles with distinct headlines, categories, regions, and one breaking story; verify the seed still validates and sample slugs are unique
- [ ] 2.3 Update `README.md` with local run and admin setup instructions; verify the commands are copy-pasteable
- [ ] 2.4 Commit and push the content model; verify the remote branch advanced

## 3. Build the public site

- [ ] 3.1 Create a shared layout with site branding from EmDash settings and the brutalist global stylesheet; verify the stylesheet is imported by the layout
- [ ] 3.2 Build the homepage with breaking strip, lead story, and reverse-chronological grid using `getEmDashCollection("articles")`; verify the query orders by `published_at` descending
- [ ] 3.3 Build `/articles/[slug]` using `getEmDashEntry`, `Image`, and `PortableText`, with a 404 for missing entries; verify the route renders headline, dek, byline, date, category, region, image, and body
- [ ] 3.4 Build `/category/[slug]` using `getTerm` and a filtered collection query; verify only matching published articles appear
- [ ] 3.5 Add a responsive collapse so the asymmetric grid becomes one column on narrow viewports; verify no horizontal overflow at phone width
- [ ] 3.6 Run `npm run build` (or the project's type check) and fix errors; verify a successful build
- [ ] 3.7 Commit and push the site implementation; verify the remote branch advanced

## 4. Verify locally and hand back

- [ ] 4.1 Start `npm run dev` in the background; verify the public site returns HTTP 200 on localhost
- [ ] 4.2 Ask the user to complete the admin setup wizard and register their own passkey; verify the dashboard opens and sample articles are listed
- [ ] 4.3 Verify publish flow by having the user edit and publish an article title, then reload the public page and confirm the change; report if any step fails
- [ ] 4.4 Run `openspec validate newsroom-cms --strict`; verify validation passes before the final commit
- [ ] 4.5 Commit and push any final fixes; report local site URL, admin URL, what is editable, and what is not working yet
