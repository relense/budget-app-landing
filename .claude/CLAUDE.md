# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing landing page for **Project Arwen** (on-page product name; repo/package name stays
`budget-app-landing`), a shared, multi-currency budget and savings tracker. Nothing is public yet:
the web app is still in staging and the mobile apps aren't published, so the page's primary CTA is
a waitlist email signup, not a link to the app. Hosts the product's real `/privacy` and `/terms`
pages. No GitHub/source links on the page (removed on request). No auth, no data fetching, no
backend of its own besides the (not-yet-built) waitlist API it POSTs to.

Sibling repos in the parent `ai-projects/` directory (same product, separate deploys):
`budget-app-web` (React/Vite web app), `budget-app-api` (Fastify/GraphQL backend),
`budget-app-mobile` (Expo/React Native app, not yet published to app stores).

See `docs/PLAN.md` for the original scaffolding plan and rationale.

## Rules (apply every session, not just the first)

- **Never invent details.** If something isn't decided in `docs/PLAN.md`, ask before writing code, don't fill the gap with a "reasonable" default.
- **Interview before coding ("grill me").** Before starting a new module or feature, ask about edge cases, data shapes, and error behavior until there's a shared understanding, don't jump from a one-line request straight to code.
- **TDD, small steps.** Failing test, then minimal code to pass, then refactor. Don't generate a whole module in one shot.
- **Money is always integer cents** (`amountCents` etc.), never float. The ×100/÷100 conversion happens only in the frontend.
- **Multi-tenancy is non-negotiable.** Every resolver reads `userId` from the authenticated context and scopes its query by it, no exceptions, not even in early dev.
- **Interface changes get flagged explicitly.** Before changing a GraphQL type, a service function signature, or the Prisma schema, say so up front, don't let it happen as a side effect of unrelated work.
- **Frontend work: ask, don't assume.** For every screen/component, ask for layout, states, copy, colors, and edge-case behavior first. Before starting the mobile app specifically, ask for the design references (mockups + Excel structure) rather than relying on memory of past conversations.
- **No new dependencies without asking first.**
- **Production hardening isn't a later step.** Graceful shutdown, crash handlers, env var validation, security headers, and GraphQL introspection/depth limits belong in the code as it's written, not retrofitted right before deploy.

## Stack

Astro 5 + Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js`), static output
(`output: 'static'`). No React, no client state. The only client JS is small inline `<script>`
blocks: the nav's mobile menu toggle, `Waitlist.astro`'s form submit handler (client-side `fetch()`
POST to `WAITLIST_API_URL`), and a shared IntersectionObserver-based scroll-reveal (`[data-reveal]`
in `src/styles/global.css`, wired up once in `src/layouts/BaseLayout.astro`).

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
- `src/lib/constants.ts` — `WAITLIST_API_URL` (currently `null`, no backend built yet; see Known
  TODOs)

## Brand tokens

Ported from `budget-app-web/src/theme/colors.ts` and `src/index.css` into
`src/styles/global.css`'s `@theme` block: Fredoka font, mint/blue/peach/pink category pastels, the
black pill CTA (`--color-pill`), 20px card radius. Keep this file as the single source of brand
tokens for this repo; don't reintroduce a `tailwind.config.js`.

## Known TODOs

- `WAITLIST_API_URL` in `src/lib/constants.ts` is `null`, there's no waitlist backend yet.
  `Waitlist.astro`'s form validates and shows a clear "not connected yet" state instead of faking
  success. Contract it expects once an endpoint exists: `POST { email: string }` -> `201` success,
  `409` if already registered, anything else treated as a generic error. Needs CORS enabled for
  this site's origin (it's a cross-origin browser `fetch()`).
- `astro.config.mjs`'s `site` and `public/robots.txt`'s sitemap line use a placeholder domain
  (`https://budgettracker.app`). Update both once a real domain is chosen, and add
  `@astrojs/sitemap` at that point.
- `public/og-image.png` was composed locally with Pillow (logo + Fredoka + brand palette), not
  screenshotted from the live design tool. Regenerate it the same way if the hero copy or palette
  changes.
