# Calculator tools — progress tracker

Tracks the ~13-tool calculator brief (marketing SEO tools under `/ferramentas`). Branch:
`feature/onbrand-calculator-tools`, off `develop`. Update this file as each tool lands — it's the
shared source of truth for what's done, in progress, and still needed, since this work spans
multiple sessions/sittings.

Scope decision (2026-09-17): build all on-brand + traffic-only tools + IRS now. Deep-linking into
`budget-app-web`, the "Guardar este resultado" email-capture backend, EN mirrors, and pushing/PR
are explicitly for afterwards (see "Deferred" section).

## Framework (done)

Built by a peer session (`free-tools-homepage-pension-calc`), merged via `develop` commit `98960c5`
+ `b26abe8`, rebased into this branch cleanly:
- `/ferramentas` and `/tools` hub pages, grouped by category (`groups` array in each hub page's
  frontmatter — append a tool by adding to an existing group's `tools` array, or add a new group).
- `NavBar.astro` "Ferramentas"/"Tools" nav item, linking to the hub (not a dropdown).
- `Footer.astro` + `FreeTools.astro` (homepage section): capped at 3 featured tools + a hub link,
  deliberately not grown per new tool — only touch these if a tool starts ranking well enough to
  earn a featured slot (peer session's stated policy, agreed on ).
- Icon convention: pick a Phosphor "regular" icon once, add its path verbatim to `Icon.astro`'s
  `PATHS` map, reuse everywhere that tool is referenced (hub card, bridge CTA, related-tools links).
- GA4 event convention (agreed with peer session): shared event names `tool_view` / `tool_completed`
  / `tool_bridge_click` / `tool_result_saved`, each with a `tool` slug param, fired via
  `if (typeof window.gtag === 'function') window.gtag('event', name, { tool: slug })`.
  `window.gtag`'s type now lives in `src/env.d.ts` (added this round — previously untyped, only
  ever called from `is:inline` scripts that skip type-checking).
- Page template: see any shipped tool page for the full shape (form → live results →
  "Como calculámos" toggle → 600–800 word explainer → FAQ accordion + `FAQPage` JSON-LD →
  related-tools links → bridge-to-app CTA card → disclaimer line → `SoftwareApplication` JSON-LD).

## On-brand tools (bridge naturally into a fund/budget)

| # | Tool | Slug | Status | Notes |
|---|------|------|--------|-------|
| 1 | Fundo de emergência | `fundo-de-emergencia` | **Done** | `src/lib/calculators/emergencyFund.ts` |
| 2 | Dividir despesas em casal | `dividir-despesas-casal` | **Done** | `src/lib/calculators/splitExpensesCouple.ts` |
| 3 | Regra 50/30/20 | `regra-50-30-20` | **Done** | `src/lib/calculators/rule502030.ts` |
| 4 | Subsídio de férias e Natal / duodécimos | `subsidio-ferias-natal-duodecimos` | Todo | Reuses `salaryCalculator.ts`'s IRS retention tables + SS 11%. Source: AT retention tables. |
| 5 | Custo real de um carro | `custo-real-carro` | Todo | Depreciation + fuel + loan amortisation. No official tax data, mostly arithmetic — low sourcing risk. |
| 6 | Amortização antecipada do crédito habitação | `amortizacao-antecipada-credito-habitacao` | Todo | French-system amortisation + early-repayment fee. Source: Banco de Portugal (fee %). |

## Traffic-only tools (rank well, weaker bridge)

| # | Tool | Slug | Status | Notes |
|---|------|------|--------|-------|
| 7 | Simulador de IRS | `simulador-irs` | **Done** | `src/lib/calculators/irsCalculator.ts`. Reuses `taxCalculator.ts`'s brackets/dependents credit (now exports `computeProgressiveIrs` too) + `salaryCalculator.ts`'s SS rate. Deduction caps + global-cap formula sourced 2026-09-17 (see file header for citations). |
| 8 | Simulador de subsídio de desemprego | `simulador-subsidio-desemprego` | Todo | 65%/55% of reference remuneration, IAS-bounded, duration table by age/contributions. Source: Segurança Social. |
| 9 | Calculadora de horas extra e trabalho nocturno | `calculadora-horas-extra` | Todo | Hourly rate formula + legal overtime/night supplements. Source: Código do Trabalho. CCT caveat. |
| 10 | Simulador de baixa médica | `simulador-baixa-medica` | Todo | Waiting period + percentage-by-duration scale. Source: Segurança Social. |
| 11 | IMT e Imposto do Selo | `imt-imposto-selo` | Todo | IMT bracket table (by type/region) + 0.8% Selo. Source: AT, per-year tables. |
| 12 | Calculadora de IVA | `calculadora-iva` | Todo | Trivial add/extract VAT, regional rates (mainland/Açores/Madeira). Lowest effort. |
| 13 | Calculadora de inflação | `calculadora-inflacao` | Todo | CPI series multiplication. Source: INE annual CPI table. |

## Build order (this round)

Per the brief's stated priority + current scope decision: 7 (IRS) done first (urgent, highest
sourcing risk). Next: **4, 6, 11** (the ones needing real sourcing but smaller), then **5, 8, 9,
10, 12, 13** (lower risk / smaller effort) in any order.

## Deferred (explicitly not this round)

- App deep-linking (`/app/funds/new?targetCents=...`) — bridge CTAs stay on the existing
  `/pt-pt/#get-the-app` anchor pattern until `budget-app-web` route support is confirmed.
- "Guardar este resultado" email-capture backend — needs a new `budget-app-api` endpoint. Suggested
  contract already given to the user in chat (POST email/tool/locale/params/newsletterOptIn →
  201/400/429, modeled on the existing `WAITLIST_API_URL` pattern). Not built here.
- EN mirrors of the on-brand tools under `/tools/` — PT-only for now.
- Wiring new tools into `Footer.astro`/`FreeTools.astro` — hub-only, per the framework policy above.
- Pushing this branch / opening a PR — still local as of the last update below.

## Sourcing discipline (non-negotiable per CLAUDE.md + the brief)

Every constant (tax bracket, rate, threshold, cap) needs a `year` + `source` (URL of the official
page) recorded in its constants file, matching `taxCalculator.ts`'s `TAX_BRACKETS_BY_YEAR` pattern.
The page itself shows "Valores de {year}, fonte: {source}". Never inline a rate without a source
comment. Tools 7, 8, 10, 11 are where a wrong number is embarrassing — verify against the primary
source (AT / Segurança Social / Banco de Portugal / Código do Trabalho), not a blog or aggregator
(see `salaryCalculator.ts`'s file comment for a real example of a secondary source being wrong).

## Log

- 2026-09-17: Tools 1–3 shipped, rebased cleanly onto peer session's framework + hub wiring. Scope
  extended to all remaining on-brand + traffic-only tools + IRS this round; rest (EN mirrors, deep
  links, save-result backend) confirmed deferred. This file created.
- 2026-09-17: Tool 7 (Simulador de IRS) shipped. Researched 2026 deduction caps + global-cap
  formula via WebSearch/WebFetch (AT's own Art. 78º page + cross-checked tax-advisory summaries,
  since the official formula is published as an image, not text). Exported `computeProgressiveIrs`
  from `taxCalculator.ts` (previously private) so this tool reuses the exact same bracket-
  application method instead of a second implementation. 15 new tests, 62/62 total passing.
