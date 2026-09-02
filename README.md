# budget-app-landing

Marketing landing page for **Arwen** (on-page product name; this repo keeps its original name),
a shared, multi-currency budget and savings tracker. Nothing is public yet, so the page's
primary CTA is a waitlist email signup rather than a link to the app. Also hosts the product's
real `/privacy` and `/terms` pages.

Sibling repos (same product, separate deploys): `budget-app-web`, `budget-app-api`,
`budget-app-mobile`.

## Stack

Astro + Tailwind CSS v4, static output. No framework, no client state: this page is content, plus
two small islands (the nav's mobile menu toggle and the waitlist form's submit handler).

## Commands

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check && astro build -> dist/
npm run preview   # serve the production build locally
```

## Structure

- `src/components/` — one section per file (`Hero.astro`, `FeatureGrid.astro`, etc.)
- `src/layouts/` — `BaseLayout.astro` (head/meta/OG) and `LegalLayout.astro` (privacy/terms)
- `src/assets/` — brand logo + screenshots, copied from `budget-app-web` and optimized at build
  time via `astro:assets`
- `src/lib/constants.ts` — `WAITLIST_API_URL`, currently `null` (no backend built yet)

## Known TODOs

- `src/lib/constants.ts`: `WAITLIST_API_URL` is `null`. `Waitlist.astro`'s form shows an honest
  "not connected yet" state until a real endpoint exists. Expected contract: `POST { email }` ->
  `201` success, `409` already registered, needs CORS enabled for this site's origin.
- `astro.config.mjs`'s `site` and `public/robots.txt`'s sitemap URL use a placeholder domain
  (`https://budgettracker.app`), update both once a real domain is chosen, and add
  `@astrojs/sitemap` at that point.
