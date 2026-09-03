# budget-app-landing

Marketing landing page for **Arwen** (on-page product name; this repo keeps its original name),
a shared, multi-currency budget and savings tracker. Nothing is public yet, so the page's
primary CTA is a waitlist email signup rather than a link to the app. Also hosts the product's
real `/privacy` and `/terms` pages.

Sibling repos (same product, separate deploys): `budget-app-web`, `budget-app-api`,
`budget-app-mobile`.

## Stack

Astro + Tailwind CSS v4, static output, dark mode only (colors sourced from
`budget-app-mobile/src/theme/colors.ts`'s `darkColors`). No framework, no client state: this page
is content, plus two small islands (the nav's mobile menu toggle and the waitlist form's submit
handler).

## Commands

```bash
cp .env.example .env   # set WAITLIST_API_URL, see .env.example
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check && astro build -> dist/
npm run preview   # serve the production build locally
```

## Structure

- `src/components/` — one section per file (`Hero.astro`, `FeatureGrid.astro`, etc.)
- `src/layouts/` — `BaseLayout.astro` (head/meta/OG/JSON-LD) and `LegalLayout.astro`
  (privacy/terms)
- `src/assets/` — brand logo, screenshots, and the self-hosted Fredoka font subset
- `src/lib/constants.ts` — `WAITLIST_API_URL`, read from the env var of the same name (see
  `.env.example`)

## Known TODOs

See `.claude/CLAUDE.md`'s Known TODOs for the current, maintained list (waitlist deploy status,
placeholder domain, OG image regeneration notes). Kept there instead of duplicated here.
