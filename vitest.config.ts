import { defineConfig } from 'vitest/config';

// Deliberately standalone, not extending astro.config.mjs -- the calculator libs under test are
// plain, dependency-free .ts with no Astro/JSX, so Astro's Tailwind Vite plugin is irrelevant here.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
