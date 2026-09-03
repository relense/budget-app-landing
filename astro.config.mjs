import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://budgettracker.app',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', { path: 'pt-pt', codes: ['pt-PT'] }],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          'pt-pt': 'pt-PT',
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
