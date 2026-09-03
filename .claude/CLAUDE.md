# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing landing page for **Arwen** (on-page product name; repo/package name stays
`budget-app-landing`). "Arwen" is the app name; "Project" is a separate parent/umbrella brand
meant to eventually host multiple apps, not part of this app's own name, don't reintroduce
"Project Arwen". A shared, multi-currency budget and savings tracker. Nothing is public yet:
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
- `src/lib/constants.ts` — `WAITLIST_API_URL`, sourced from the `WAITLIST_API_URL` env var (see
  `.env.example` and `src/env.d.ts`), not hardcoded; differs per environment (local/prod)
- `src/env.d.ts` — `ImportMetaEnv` augmentation for `WAITLIST_API_URL`, needed since it's a
  non-`PUBLIC_`-prefixed custom env var (fine here: it's only ever read in `.astro` frontmatter, a
  build-time context, then explicitly passed into `Waitlist.astro`'s inline script via
  `define:vars` — never referenced directly inside client-bundled JS, so the `PUBLIC_` prefix
  Vite/Astro requires for that case doesn't apply)

## SEO

`@astrojs/sitemap` generates `sitemap-index.xml` at build from `site` in `astro.config.mjs`,
referenced from `public/robots.txt`. `BaseLayout.astro` emits a sitewide `WebSite` JSON-LD block;
`Faq.astro` emits its own `FAQPage` JSON-LD generated from the same array that renders its visible
`<details>` accordion, so the structured data can't drift from the visible content. Keep it that
way, don't hand-maintain a separate copy of the FAQ text for the schema.

## i18n (English + pt-PT)

English is the default locale, unprefixed (`/`, `/privacy`, `/terms`); Portuguese lives under
`/pt-pt/` (`/pt-pt/`, `/pt-pt/privacy`, `/pt-pt/terms`). Configured via Astro's built-in `i18n`
routing in `astro.config.mjs` (`defaultLocale: 'en'`, `locales: ['en', { path: 'pt-pt', codes:
['pt-PT'] }]`, `prefixDefaultLocale: false`) — Astro doesn't auto-generate translated pages from
this, it's routing/URL convention plus `Astro.currentLocale` only; the actual page files under
`src/pages/pt-pt/` are hand-duplicated. No visible language switcher: a first-visit-only,
localStorage-remembered redirect in `BaseLayout.astro` sends English-page visitors with a
Portuguese browser language to the `/pt-pt/` equivalent, one-directional only (never redirects
someone away from a `/pt-pt/` page they navigated to directly, e.g. a shared link).

- `src/i18n/ui.ts` — the single translation dictionary, keyed by section (`hero.title`,
  `faq.items`, etc.), one object per locale. **The `'pt-pt'` values are European Portuguese
  (not pt-BR) written by Claude, informal "tu" register, not reviewed by a native speaker** — worth
  a proofread pass before treating as final. Any new UI string goes in both locale objects.
- `src/i18n/utils.ts` — `getLangFromUrl(url)` (derives `'en' | 'pt-pt'` from the path prefix),
  `useTranslations(lang)` (returns a `t(key)` getter), `getAlternatePath()` (maps a path to its
  other-locale equivalent, used for hreflang and the redirect), `htmlLang` (maps `'pt-pt'` →
  `pt-PT` for the `<html lang>` attribute).
- Every component that renders copy calls `getLangFromUrl(Astro.url)` + `useTranslations(lang)`
  itself (not threaded via props) and pulls its strings from `t()`. `BaseLayout.astro` also emits
  `hreflang` alternate `<link>` tags (self + the other locale + `x-default` pointing at English)
  for every page; `@astrojs/sitemap`'s `i18n` option in `astro.config.mjs` mirrors this into
  `sitemap-index.xml` automatically.
- `src/pages/privacy.astro` / `terms.astro` and their `src/pages/pt-pt/` counterparts: both the
  page chrome (title/description/heading, from `t('privacyPage.*')` / `t('termsPage.*')`) and the
  legal body copy are translated. The `pt-pt/privacy.astro` and `pt-pt/terms.astro` bodies carry a
  comment at the top of each file noting the translation is Claude's, not lawyer- or
  native-speaker-reviewed — legal text carries real risk if loosely translated, so have it
  proofread before treating it as final.
- `404.astro` stays English-only, deliberately not duplicated under `/pt-pt/`: static hosts only
  ever serve one root-level `404.html` as the catch-all for unmatched routes, so a locale-prefixed
  404 page wouldn't be reachable through that fallback anyway.
- `public/og-image.png` (see the TODO below) is still English-only; no pt-PT variant exists yet.

## Brand tokens & theme

Dark mode is this page's single locked theme, no light variant, no toggle (see Page Theme Lock in
the design-taste-frontend skill). Every color in `src/styles/global.css`'s `@theme` block is copied
verbatim from `budget-app-mobile/src/theme/colors.ts`'s `darkColors` export (comments in
`global.css` note which token each one mirrors), not from the web app's light theme and not
invented. Two things to know before touching colors:

- Pastel category surfaces (mint/pink/purple/blue/peach/teal) are identical between mobile's light
  and dark mode by mobile's own design, so they're used directly as backgrounds for cards/chips/
  banners, same as mobile does. Don't tint them for "dark mode" — they're already right.
- `--color-on-surface` / `--color-placeholder` exist for text drawn on a *fixed light* surface
  embedded in the dark page (currently: the waitlist email input). This mirrors mobile's own
  `text.onSurface` pattern, which is identical in both of its modes for exactly this reason. Any
  new white/light input or chip needs this treatment, not `--color-ink` (which is light-on-dark
  text and will go invisible on a light fill).

Fredoka font, 20px card radius, pill-shaped buttons carried over as before. Keep `global.css` as
the single source of tokens; don't reintroduce a `tailwind.config.js`.

## Known TODOs

- Waitlist end-to-end verified working (2026-09-03) against a local `budget-app-api` dev server
  on port 4400: real 201 on signup, real 409 on a repeat submission, correct message for each.
  Production URL (`https://budget-app-api-6hrz.onrender.com/waitlist`) is set in `.env.example`
  as the documented value but 404s as of this date — the route landed on `budget-app-api`'s
  `develop` branch (PR #117) but hasn't been promoted to `main`/redeployed yet. No frontend work
  left here; this is purely "wait for that deploy," then set `WAITLIST_API_URL` to that URL in
  whatever's providing env vars for the actual production build (Cloudflare Pages' dashboard, not
  a committed file). CORS on their end is a placeholder any-origin until this site has a real
  domain, at which point tell that session the domain so they can lock it down.
- `astro.config.mjs`'s `site` and `public/robots.txt`'s sitemap line use a placeholder domain
  (`https://budgettracker.app`). `@astrojs/sitemap` is already wired up and generates
  `sitemap-index.xml` from whatever `site` is set to, so updating that one value once a real
  domain exists is all that's needed, no further sitemap work. Same domain also needs to go back
  to `budget-app-api` for its CORS lock-down, see the `WAITLIST_API_URL` TODO above.
- `public/og-image.png` was composed locally with Pillow (logo + Fredoka + brand palette). Not
  screenshotted from a live design tool, regenerate the same way (script isn't checked in, rebuild
  it from `og-image.png`'s own content if it needs to change again) if the hero copy, palette, or
  name changes.
