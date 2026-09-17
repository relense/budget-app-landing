/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly WAITLIST_API_URL?: string;
  /** PUBLIC_-prefixed since, unlike WAITLIST_API_URL, this one IS referenced directly inside
   * client-bundled JS (CookieConsent.astro's inline script loads gtag.js with it) -- Vite/Astro
   * requires the prefix for any env var read in that context. */
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Set by CookieConsent.astro's inline script, only after consent -- always optional and always
   * guarded with `typeof window.gtag === 'function'` before use, since it may never load (consent
   * rejected) or not have loaded yet. */
  gtag?: (...args: unknown[]) => void;
}
