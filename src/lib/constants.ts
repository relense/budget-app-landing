// No URL yet, waiting on budget-app-api's deployed domain. Set this once it exists and
// Waitlist.astro's form starts actually submitting instead of showing its "not connected
// yet" state -- no other frontend change needed, the contract below is already fully wired up.
//
// Confirmed contract (budget-app-api's POST /waitlist, CORS already handled on their end):
//   POST <url> { "email": string } ->
//     201  success
//     409  already on the list
//     400  missing/malformed email
//     429  same email retried >5x/hour (abuse protection)
//     else generic error
//
// Once this is set to a real deployed URL, tell the budget-app-api session that domain so
// they can lock its CORS down from the current any-origin placeholder to just this one.
export const WAITLIST_API_URL: string | null = null;

export const CREATOR_GITHUB_URL = 'https://github.com/relense';
