# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing landing page for **Budget Tracker**, a shared, multi-currency budget and savings
tracker. Points visitors to the live web app (`https://budget-app-web-sjzr.onrender.com`) and the
GitHub repos, and hosts the product's real `/privacy` and `/terms` pages (not links out to the web
app). No auth, no data fetching, no backend of its own.

Sibling repos in the parent `ai-projects/` directory (same product, separate deploys):
`budget-app-web` (React/Vite web app), `budget-app-api` (Fastify/GraphQL backend),
`budget-app-mobile` (Expo/React Native app, not yet published to app stores).

See `docs/PLAN.md` for the original scaffolding plan and rationale.

## Stack

Astro 5 + Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js`), static output
(`output: 'static'`). No React, no client state. The only client JS is small inline `<script>`
blocks: the nav's mobile menu toggle, the screenshot gallery's desktop/mobile tab switcher, and a
shared IntersectionObserver-based scroll-reveal (`[data-reveal]` in `src/styles/global.css`,
wired up once in `src/layouts/BaseLayout.astro`).

## Commands

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check && astro build -> dist/
npm run preview   # serve the production build locally
```

## Structure

- `src/components/` — one section per file, assembled in `src/pages/index.astro`
- `src/components/Icon.astro` — inline SVGs, path data copied verbatim from
  `@phosphor-icons/core`'s regular set (never hand-drawn; add new icons the same way)
- `src/layouts/BaseLayout.astro` — `<head>`, SEO/OG meta, the reveal-on-scroll script
- `src/layouts/LegalLayout.astro` — shared shell for `/privacy` and `/terms`
- `src/assets/brand/`, `src/assets/screenshots/` — copied from `budget-app-web`'s `public/` and
  `design/` folders, optimized at build time via `astro:assets` (`<Image />`)
- `src/lib/constants.ts` — web app URL, GitHub repo links, app store links (currently `null`)

## Brand tokens

Ported from `budget-app-web/src/theme/colors.ts` and `src/index.css` into
`src/styles/global.css`'s `@theme` block: Fredoka font, mint/blue/peach/pink category pastels, the
black pill CTA (`--color-pill`), 20px card radius. Keep this file as the single source of brand
tokens for this repo; don't reintroduce a `tailwind.config.js`.

## Known TODOs

- `IOS_STORE_URL` / `ANDROID_STORE_URL` in `src/lib/constants.ts` are `null` until the mobile app
  is published. `GetTheApp.astro` renders a disabled state until they're set.
- `astro.config.mjs`'s `site` and `public/robots.txt`'s sitemap line use a placeholder domain
  (`https://budgettracker.app`). Update both once a real domain is chosen, and add
  `@astrojs/sitemap` at that point.
- `public/og-image.png` was composed locally with Pillow (logo + Fredoka + brand palette), not
  screenshotted from the live design tool. Regenerate it the same way if the hero copy or palette
  changes.
