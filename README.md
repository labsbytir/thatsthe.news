# thatsthe.news

automated news. around the clock. updated in realtime where you are.

This is the local, editable newsroom site built with [EmDash](https://emdashcms.com/) and Astro. Content lives in EmDash, not in the source files. Published edits appear on the public site on the next request.

## Run locally

Requires Node.js 22.23.4 or later.

```bash
npm install
npm run dev
```

- Public site: http://localhost:4321/
- Admin: http://localhost:4321/_emdash/admin/

On first run, complete the setup wizard in the admin. Enter a site title and tagline, keep **Include sample content** selected, add your email, and register a passkey when the browser prompts. The passkey stays in your browser — never share it or commit `.env`.

## What is editable

- **Articles** — headline, dek, body, hero image, breaking flag, edition (region), section, tags, and byline.
- **Pages** — the About page.
- **Site settings** — site title and tagline.
- **Navigation** — the primary menu.

Edit an article, save, then select **Publish changes**. Reload the public page to see it.

## Where things live

- `seed/seed.json` — initial content model and sample articles, applied during first setup.
- `astro.config.mjs` — SQLite database and local media storage.
- `src/pages/` — server-rendered homepage, article pages, and section archives.
- `src/styles/theme.css` — brutalist visual system.

## Checks

```bash
npx emdash seed seed/seed.json --validate
npm run typecheck
npm run build
```

Local secrets (`.env`) and the local database (`data.db`) are gitignored. Nothing here is deployed yet.
