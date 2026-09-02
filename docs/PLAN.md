# Budget Tracker — Marketing Landing Page

## Context

`budget-app-landing` is currently an empty directory. The user wants a marketing landing page for **Budget Tracker**, a shared, multi-currency budget/savings-tracking product that already exists as three sibling repos in `ai-projects/`:

- `budget-app-api` — Fastify/GraphQL backend, live at `https://budget-app-api-6hrz.onrender.com`
- `budget-app-web` — React web app, live at `https://budget-app-web-sjzr.onrender.com` (working login/signup + legal pages)
- `budget-app-mobile` — Expo/React Native app, built but **not yet published** to the App Store/Play Store

This is a solo portfolio project ("Portfolio piece, but engineered to be deployed, used by multiple people, and handed off cleanly" — per the sibling repos' own README). There's no pricing, no monetization, no marketing copy or brand assets anywhere yet outside the app UI itself. The goal of this landing page is to give the product a real front door: explain what it does, show it working (via real screenshots), and send visitors to the live web app — while being honest about its stage (no invented metrics, testimonials, or pricing).

Research already completed (three parallel Explore agents + a Plan agent) confirmed the product's feature set, verified the brand assets (logo, color tokens, font) actually exist and match across web/mobile, and located real, clean, high-quality UI screenshots suitable for marketing use — no illustration/mockup budget is needed.

## Tech Stack: Astro + Tailwind CSS v4, static output

**Not** React/Vite (the sibling web app's stack) and **not** Next.js.

- This page has zero app state — no auth, no data fetching, just content. Astro ships zero JS by default and only hydrates the one interactive piece (a screenshot gallery tab-switcher), which is exactly right for Lighthouse/SEO-sensitive marketing pages.
- Astro has first-class Tailwind v4 support and built-in image optimization (`astro:assets`, Sharp-based) — solves compressing/resizing the screenshot PNGs (some are ~100–280KB at native size) automatically at build time.
- Fresh empty repo, so there's no cost to not matching the sibling apps' framework — brand consistency comes from shared fonts/colors/logo (below), not shared tooling.
- Next.js static export fights its own image-optimization defaults for no benefit here; plain HTML/CSS/JS would lose component reuse (repeating feature cards, screenshot frames) for no real simplicity gain over Astro's near-zero-config setup.

## Content & Page Structure

Single long-scroll `src/pages/index.astro`, plus **real, canonical `/privacy` and `/terms` pages hosted on the landing site itself** (per explicit user direction — not links out to the web app). Content is ported/adapted from the existing copy at `budget-app-web/src/pages/Profile/PrivacyPolicyPage.tsx` and `TermsOfServicePage.tsx` (read and rewrite as static Astro pages — do not invent new legal text). The landing page becomes the source of truth for these documents; the web/mobile apps' own privacy/terms links can be pointed here later, but that's out of scope for this repo/task.

1. **Nav** — logo + "Budget Tracker" wordmark, anchor links (Features / How it works), primary CTA button "Get started".
2. **Hero** — headline + subhead describing the core loop (shared, multi-currency budget/savings tracker), primary CTA **"Get started"** → live web app (`https://budget-app-web-sjzr.onrender.com`), secondary CTA **"View the code"** → `https://github.com/relense/budget-app-web` (GitHub org confirmed as `relense`). Hero visual: desktop `04-screens.png` (light theme Home dashboard) paired with mobile `05-home.png` (dark theme Home dashboard) — same data, two themes/form factors, no illustration needed.
3. **Trust strip** — "No ads. No data-selling. No bank-sync creepiness." (directly from the verified in-repo policy stance, not invented).
4. **How it works** (3–4 steps) — set up categories & budget → log expenses / auto-track recurring bills → watch your Month Balance → grow Savings Funds. Small cropped screenshots per step.
5. **Feature grid** (6–8 cards, all verified-real features only): Shared Workspaces (Editor/Viewer roles), multi-currency display (10 currencies), recurring expenses, Savings Funds, month locking + 24-month planning horizon, passwordless email-OTP login, Light/Dark/System theming, data export & account deletion. **Do not** mention bank sync, AI features, notifications, or reports — explicitly not built.
6. **Screenshot gallery** — Desktop/Mobile tab-switcher (the one Astro island), curated ~6–8 screenshots from the table below.
7. **"Built like a real product"** section — short, factual: TDD, hundreds of commits, 300+ backend tests, three-repo architecture, GraphQL API — framed as engineering craft, not startup hype.
8. **"Get the app" section** — a dedicated band with two paths: (a) **"Get started" / "Log in"** → the live web app, framed as "works right now, no install needed"; (b) **"Download the app"** for iOS/Android — the user will supply the actual store link(s) later, so scaffold this as a clearly-labeled placeholder CTA (e.g. a disabled-looking button or a `TODO:` link constant in the component) rather than inventing or guessing a URL. Honest framing if the store link isn't ready at ship time (e.g. "iOS & Android app — link coming soon").
9. **Final CTA band** — repeat "Get started" / "View the code".
10. **Footer** — logo, links to the landing site's own `/privacy` and `/terms` pages, GitHub links, no newsletter/social (doesn't exist, don't invent it).

**CTA strategy**: primary CTA everywhere is **"Get started"** linking directly to the live, working web app (doubles as "login" since the app's own auth flow handles both) — there's a real product behind this, so a waitlist would undersell it. Secondary CTA is always **"View the code"** since portfolio reviewers are part of the audience. The mobile app gets its own clearly-labeled placeholder CTA in the dedicated "Get the app" section (see above) since it isn't published yet and the store link isn't available at planning time.

## Assets — copy into the new repo (not referenced in place)

Copy once at setup (these are independently-deployable repos; the landing page must build standalone):

| Source | Destination |
|---|---|
| `budget-app-web/public/logo.png` | `src/assets/brand/logo.png` |
| `budget-app-web/public/favicon.png` | `public/favicon.png` |
| `budget-app-web/public/apple-touch-icon.png` | `public/apple-touch-icon.png` |
| `budget-app-web/design/web/screenshots/04-screens.png` (Home, desktop) | `src/assets/screenshots/desktop-home.png` |
| `budget-app-web/design/web/screenshots/05-screens.png` | `src/assets/screenshots/desktop-category-detail.png` |
| `budget-app-web/design/web/screenshots/07-screens.png` | `src/assets/screenshots/desktop-categorize.png` |
| `budget-app-web/design/web/screenshots/11-screens.png` | `src/assets/screenshots/desktop-savings.png` |
| `budget-app-web/design/web/screenshots/16-screens.png` | `src/assets/screenshots/desktop-add-expense.png` |
| `budget-app-web/design/mobile/05-home.png` | `src/assets/screenshots/mobile-home.png` |
| `budget-app-web/design/mobile/06-budget-tab.png` | `src/assets/screenshots/mobile-budget.png` |
| `budget-app-web/design/mobile/14-savings.png` | `src/assets/screenshots/mobile-savings.png` |
| `budget-app-web/design/mobile/16-profile.png` | `src/assets/screenshots/mobile-profile.png` |

Verify each screenshot's actual content by viewing it before use (filenames like `NN-screens.png` are not self-descriptive and the README's numbering doesn't reliably match). Put screenshots under `src/assets/` (not `public/`) so `astro:assets`' `<Image />` component can resize/compress/emit responsive `srcset` at build time.

Net-new asset needed: **`public/og-image.png`** (1200×630) — no existing asset fits; compose from the logo mark + brand palette + optionally the desktop Home screenshot.

## Visual Design System

Port the verified `budget-app-web/src/theme/colors.ts` tokens and Fredoka font (loaded the same way as `budget-app-web/src/index.css`) into a Tailwind v4 CSS-first `@theme` block in `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600&display=swap');
@import 'tailwindcss';

@theme {
  --font-sans: 'Fredoka', system-ui, sans-serif;
  --color-bg: #FFFFFF;
  --color-bg-dark: #1E1E1E;
  --color-text-primary: #1A1A1A;
  --color-text-primary-dark: #F2F2F2;
  --color-mint: #CFF3DA;
  --color-accent-blue: #2F80ED;
  --color-pill-bg: #131313;
  --color-identity-pink: #FFCCDB;
  --color-destructive: #F2705C;
  --color-cat-green-bg: #CFF3DA;  --color-cat-green-icon: #234D2E;
  --color-cat-pink-bg: #F7D6DE;   --color-cat-pink-icon: #A24F63;
  --color-cat-purple-bg: #E7DAF5; --color-cat-purple-icon: #7A5AA8;
  --color-cat-blue-bg: #D8E7F7;   --color-cat-blue-icon: #3E6FA6;
  --color-cat-peach-bg: #F6DECB;  --color-cat-peach-icon: #B97A4C;
  --color-cat-teal-bg: #D6F1EC;   --color-cat-teal-icon: #327E71;
  --color-cat-yellow-bg: #F5E27A; --color-cat-yellow-icon: #8A6D1A;
  --radius-card: 20px;
  --radius-pill: 999px;
}
```

Marketing-appropriate deviations from the in-app UI: bigger type for the hero (56–72px headline, can use Fredoka 500/600 weight even though the app itself stays at 400), generous section padding (80–120px vs. the app's 16–32px). Keep pill-shaped buttons, 18–20px card radii, and the soft `0 2px 10px rgba(0,0,0,.04)` shadow so it still reads as the same product family. No dark-mode toggle needed for v1 — the screenshots themselves already show both themes.

## Project Scaffolding

```
budget-app-landing/
├── CLAUDE.md                     # update once built
├── package.json
├── astro.config.mjs              # output: 'static', Tailwind vite plugin, site: <domain>
├── tsconfig.json
├── .gitignore
├── public/
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   └── og-image.png
├── src/
│   ├── assets/
│   │   ├── brand/logo.png
│   │   └── screenshots/          # per table above
│   ├── styles/global.css
│   ├── components/
│   │   ├── NavBar.astro
│   │   ├── Hero.astro
│   │   ├── TrustStrip.astro
│   │   ├── HowItWorks.astro
│   │   ├── FeatureGrid.astro
│   │   ├── ScreenshotGallery.astro   # + small island script for tab switching
│   │   ├── PortfolioNote.astro
│   │   ├── GetTheApp.astro           # web "Get started" CTA + placeholder mobile download CTA
│   │   ├── CtaBand.astro
│   │   └── Footer.astro
│   ├── layouts/BaseLayout.astro      # <head> meta/OG/favicon
│   └── pages/
│       ├── index.astro
│       ├── privacy.astro             # ported from budget-app-web's PrivacyPolicyPage.tsx
│       └── terms.astro               # ported from budget-app-web's TermsOfServicePage.tsx
└── README.md
```

- `package.json`: `astro`, `@tailwindcss/vite`, `tailwindcss` v4 (+ `sharp` auto-installed for `astro:assets`). Scripts: `dev`, `build` (`astro check && astro build`), `preview`.
- No `tailwind.config.js` — CSS-first `@theme`, matching `budget-app-web`'s own approach.
- No test framework needed at this scope (static content, no logic).

**Hosting: Cloudflare Pages** (Vercel/Netlify equivalent alternatives) rather than Render. The sibling apps use Render because they run actual backend/SPA-serving processes; this is pure static `astro build` output with no server need — a static host gives a free global CDN, automatic HTTPS, and zero cold starts for a page whose whole job is to load fast.

## SEO / Meta

In `BaseLayout.astro`: honest `<title>`/`<meta description>` (no superlatives, no invented numbers), Open Graph + Twitter card tags using the new `og-image.png`, favicon/apple-touch-icon reused from `budget-app-web`, `robots.txt` + `@astrojs/sitemap` once a real domain is chosen for `site:` in `astro.config.mjs`.

## Verification

- `npm run dev` — visually check every section renders, nav anchors scroll correctly, both CTA links point to the right live URLs (`https://budget-app-web-sjzr.onrender.com` and the GitHub org), screenshot gallery tab-switcher works with JS.
- Confirm `/privacy` and `/terms` render as real static pages on the landing site (not external redirects) with the ported legal copy, and that the footer links to them internally.
- Confirm the "Get the app" section shows a working "Get started"/"Log in" link to the web app and a clearly-labeled placeholder for the mobile download link (not a broken or guessed URL) — flag to the user where to drop in the real store link once available.
- `npm run build && npm run preview` — confirm static build succeeds, `astro check` passes, images are actually optimized (check output file sizes in `dist/`), OG/meta tags render correctly (verify via view-source or a social preview debugger).
- Resize the browser to confirm the layout is responsive (hero image pairing, feature grid, gallery) down to mobile widths.
