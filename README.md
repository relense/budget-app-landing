# budget-app-landing

Marketing landing page for **Budget Tracker**, a shared, multi-currency budget and savings
tracker. Points visitors to the live web app and the source repos; also hosts the product's
`/privacy` and `/terms` pages.

Sibling repos (same product, separate deploys): `budget-app-web`, `budget-app-api`,
`budget-app-mobile`.

## Stack

Astro + Tailwind CSS v4, static output. No framework, no client state: this page is content, plus
one small island (the screenshot gallery's desktop/mobile tab switcher).

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
- `src/lib/constants.ts` — the web app URL, GitHub repo links, and the (currently unset) app store
  links

## Known TODOs

- `src/lib/constants.ts`: `IOS_STORE_URL` / `ANDROID_STORE_URL` are `null` until the mobile app is
  published. The "Get the app" section renders a clearly-labeled disabled state until then.
- `astro.config.mjs`'s `site` and `public/robots.txt`'s sitemap URL use a placeholder domain
  (`https://budgettracker.app`) — update both once a real domain is chosen, and add
  `@astrojs/sitemap` at that point.
