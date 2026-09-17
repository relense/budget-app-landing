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
| 4 | Subsídio de férias e Natal / duodécimos | `subsidio-ferias-natal-duodecimos` | **Done** | `src/lib/calculators/paySchedule.ts` — thin 12-month calendar wrapper over `salaryCalculator.ts`'s existing `calculateSalary` (no new tax logic needed, it already modeled subsidy withholding + duodécimos). |
| 5 | Custo real de um carro | `custo-real-carro` | **Done** | `src/lib/calculators/trueCarCost.ts`. IUC taken as a direct input rather than derived from its own bracket tables (scope cut, flagged in the module). |
| 6 | Amortização antecipada do crédito habitação | `amortizacao-antecipada-credito-habitacao` | **Done** | `src/lib/calculators/mortgagePrepayment.ts`. French-system amortisation, reduceTerm/reduceInstallment/monthly modes. 2026 fee caps (0.5%/2%) sourced via WebSearch against Banco de Portugal's own page — confirmed the temporary variable-rate exemption expired 2025-12-31. |

## Traffic-only tools (rank well, weaker bridge)

| # | Tool | Slug | Status | Notes |
|---|------|------|--------|-------|
| 7 | Simulador de IRS | `simulador-irs` | **Done** | `src/lib/calculators/irsCalculator.ts`. Reuses `taxCalculator.ts`'s brackets/dependents credit (now exports `computeProgressiveIrs` too) + `salaryCalculator.ts`'s SS rate. Deduction caps + global-cap formula sourced 2026-09-17 (see file header for citations). |
| 8 | Simulador de subsídio de desemprego | `simulador-subsidio-desemprego` | **Done** | `src/lib/calculators/unemploymentBenefit.ts`. Corrected the brief's own assumption: the "-10% after 180 days" rule was repealed in 2018 — flat 65% the whole duration. Full 2012+ duration table + IAS floors/ceiling sourced. |
| 9 | Calculadora de horas extra e trabalho nocturno | `calculadora-horas-extra` | **Done** | `src/lib/calculators/overtimePay.ts`. Art. 268º/266º CT percentages (Lei 13/2023), two-tier 100h/year threshold. CCT caveat flagged in explainer. |
| 10 | Simulador de baixa médica | `simulador-baixa-medica` | **Done** | `src/lib/calculators/sickLeaveBenefit.ts`. 3-day waiting period, 55/60/70/75% bands by leave-day, RR=salary/30 approximation. Employees only (self-employed have a 10-day wait, not modeled). |
| 11 | IMT e Imposto do Selo | `imt-imposto-selo` | **Done** | `src/lib/calculators/imtStampDuty.ts`. Mainland only (Açores/Madeira scope-cut, flagged). 2026 bracket tables + IMT Jovem thresholds sourced via WebSearch/WebFetch (APCMC practical tables, cross-checked). |
| 12 | Calculadora de IVA | `calculadora-iva` | Todo | Trivial add/extract VAT, regional rates (mainland/Açores/Madeira). Lowest effort. |
| 13 | Calculadora de inflação | `calculadora-inflacao` | Todo | CPI series multiplication. Source: INE annual CPI table. |

## Build order (this round)

Per the brief's stated priority + current scope decision: 7, 4, 6, 11, 5, 8, 9, 10 all done.
Remaining: **12, 13**.

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
- 2026-09-17: Tool 4 (Subsídio de Férias e Natal / duodécimos) shipped. No new tax logic —
  `salaryCalculator.ts`'s `calculateSalary` already modeled subsidy withholding and duodécimos
  correctly; this tool is just `paySchedule.ts` turning that into a 12-month calendar. 5 new tests,
  67/67 total passing.
- 2026-09-17: Tool 6 (Amortização Antecipada) shipped. French-system amortisation from scratch
  (`mortgagePrepayment.ts`), worked example independently cross-checked via a standalone Node
  computation of the same formulas before being hardcoded into the test file. New "Casa e crédito"
  hub group created (IMT/Selo will join it later). Fee caps sourced via WebSearch against Banco de
  Portugal directly. 8 new tests, 75/75 total passing.
- 2026-09-17: Tool 11 (IMT e Imposto do Selo) shipped. Mainland-only 2026 bracket tables +
  IMT Jovem exemption thresholds sourced via WebSearch/WebFetch (APCMC's practical tables page,
  cross-checked the two highest-bracket thresholds against a second source since they weren't on
  the first page's visible text). Joined the "Casa e crédito" hub group. 9 new tests, 84/84 total
  passing.
- 2026-09-17: Tool 5 (Custo Real de um Carro) shipped. Mostly arithmetic (depreciation, fuel,
  optional loan interest); IUC modeled as a direct input rather than its own bracket tables, per
  the module's own scope-cut comment. 6 new tests, 90/90 total passing.
- 2026-09-17: Tool 8 (Simulador de Subsídio de Desemprego) shipped. Important correction caught
  while researching: the original brief assumed a "-10% after 180 days" reduction, but that rule
  was repealed in 2018 (Lei n.º 114/2017) — many still-live blog pages quote it as current, but it
  isn't; not modeled. Full duration table (age x contribution-months, cross-checked against a
  second source) + 2026 IAS floors/ceiling sourced. 8 new tests, 98/98 total passing.
- 2026-09-17: Tool 9 (Calculadora de Horas Extra e Trabalho Noturno) shipped. Art. 268º/266º CT
  percentages (as amended by Lei 13/2023) sourced via WebSearch, two-tier 100-annual-hours
  threshold modeled. 9 new tests, 107/107 total passing.
- 2026-09-17: Tool 10 (Simulador de Baixa Médica) shipped. 3-day waiting period (0 for
  hospitalisation) + 55/60/70/75% bands by calendar day of leave, sourced via WebSearch against
  Segurança Social's own published rules. 6 new tests, 113/113 total passing.
