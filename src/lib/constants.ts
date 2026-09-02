// No endpoint yet. Point this at a real waitlist API (e.g. a new mutation/route
// on budget-app-api) once one exists, then Waitlist.astro's form will start
// actually submitting instead of showing its "not connected yet" state.
// Expected contract: POST { email: string } -> 201 on success, 409 if the
// email is already on the list, anything else treated as a generic error.
export const WAITLIST_API_URL: string | null = null;
