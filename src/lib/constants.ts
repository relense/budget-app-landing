// Sourced from the WAITLIST_API_URL env var (see .env.example), not hardcoded, since this
// value legitimately differs across local dev (a local budget-app-api server), staging, and
// production -- set it per-environment (Cloudflare Pages' dashboard for prod/preview deploys,
// a local .env for dev). Falls back to null (Waitlist.astro's honest "not connected yet" state)
// if unset, e.g. a fresh clone with no .env.
//
// Confirmed contract (POST /waitlist, CORS already handled on their end):
//   POST <url> { "email": string } ->
//     201  success
//     409  already on the list
//     400  missing/malformed email
//     429  same email retried >5x/hour (abuse protection)
//     else generic error
//
// Production value: https://budget-app-api-6hrz.onrender.com/waitlist -- exists on
// budget-app-api's `develop` branch (PR #117) but not yet promoted to `main`/redeployed as of
// 2026-09-03 (confirmed by curling it: 404). Once this site has a real domain, tell the
// budget-app-api session so they can lock its WAITLIST_CORS_ORIGIN down from the current
// any-origin placeholder to just this one.
export const WAITLIST_API_URL: string | null = import.meta.env.WAITLIST_API_URL ?? null;

export const CREATOR_GITHUB_URL = 'https://github.com/relense';

// Plus subscription checkout, hosted on the web app (not this static site) -- purchases happen
// there, never in an app store, so both locales link to the same URL.
export const PRICING_URL = 'https://app.otterbond.app/plans';
