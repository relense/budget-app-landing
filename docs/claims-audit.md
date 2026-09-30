# Marketing claims vs. what the app really does

Audited 2026-09-30 against `budget-app-mobile`, `budget-app-web` and `budget-app-api`. **Rule: if the app
can't do it (or does it differently), the site doesn't say it.** Re-check this list whenever the app or the
copy changes. Sources are file paths in the sibling repos.

## Corrected (was wrong, is now right)

| Was on the site | What the app actually does | Evidence |
|---|---|---|
| "updated every morning" / "tells you every morning" | The number is computed live when the app is opened. There is no push notification, no daily reminder, no scheduled job. | `safeToSpendService.ts` (uses now()); no expo-notifications in mobile |
| "If it's green, go" | The daily number never changes colour. States are wording only ("X/day until the 5th", "X short before payday", "X over budget this month"). | `budget-app-mobile/app/(app)/(tabs)/index.tsx` (always `text.primary`) |
| "Automatically sets aside what you need for IRS and Social Security" (and similar) | Nothing moves money. A savings fund has a planned monthly amount; the daily number subtracts it until the user records the deposit. The calculators are standalone and don't feed the app. | `savingsFundService`, `FundThisCycleSection.tsx`, `tax-calculator.tsx` |
| "A foreign salary and a euro rent side by side" / "each person sees their own currency" | One currency per workspace (owner can set it for everyone). Changing currency relabels numbers, no conversion. Transactions have no currency field. | `prisma/schema.prisma` (`Workspace.currency`), `effectiveCurrency.ts` |
| "Lock the month on the last day" / "starts you clean" | Only past months can be locked (not the current one). Locking freezes the month and saves its ending balance; carrying budgets forward is a separate step. | `budgetMonthService.ts` `lockMonth` |
| "Invite anyone by email" / "add a friend first" | Workspace invites need an existing account (email). App invites are a separate flow. Friends are optional. | `schema.ts` `inviteMember` (`INVITEE_NOT_FOUND`) |
| Free reports "none" / "history" | Free: the current month and the latest locked month. Plus: every month. | `MonthReportsPage.tsx`, `month-reports.tsx` |
| "15-day free trial" | Card required up front, once per person, charged on day 15 unless cancelled. | `docs/MONETIZATION.md`, landing `terms.astro` |
| "No third-party tracking of any kind" | No analytics/ads SDKs in the apps. The API uses Sentry for error reports and keeps first-party usage stats for 90 days. | `budget-app-api/package.json`, landing `privacy.astro` |
| Structured data `operatingSystem: Web, iOS, Android` | Only the web app is live; iOS/Android are on the waitlist. | `llms.txt`, `index.astro` |
| Portuguese name "Podes Gastar" | The app's pt-PT name is "Disponível para Gastar". | mobile/web pt-PT `safeToSpend.json` |
| "Feedback board" | The app calls it the Ideas board. | api `votePost` / UI strings |
| Free/Plus lists | Workspaces: 2 Free / 5 Plus; members per shared workspace: 2 / 5. Savings what-if slider is Plus; the plain projection sentence is Free. | `plan.ts`, `FundWhatIfControl.tsx` |

## Verified true (safe to keep saying)

Free has budget, bills, savings funds, the Safe to Spend number, the month wrap and 10 currencies. Timeline,
pace and insights are Plus. Plus is 5 workspaces and planning 24 months ahead (Free: the next month).
Sign-in is passwordless (emailed one-time code). There is no bank sync and no CSV/Excel import. Purchases
happen on the web (Stripe), no in-app purchase. Editor/Viewer roles exist. One person logs, the other can
categorize later (in-app notification, not push). The four in-app calculators are free.

## Still not verifiable from code

- The EUR 2.99 price lives in Stripe (`STRIPE_PRICE_ID_PLUS`), not in the repo.
- That the web app is live at `app.otterbond.app` (only implied by config).
- Which insight types exist in `insightsService.ts` (price changes and duplicate charges are named in the UI strings).

## Not to promise (roadmap only)

Financial thermometer as a Plus feature, peer comparison, invoice keeper, "data analysis" (all listed as
unbuilt in the web app's own plans page); any spreadsheet/CSV import; automatic deposits.
