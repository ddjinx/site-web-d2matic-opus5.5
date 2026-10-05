// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domaine canonique unique : https, sans www. Utilisé partout (canonical, sitemap, JSON-LD, llms.txt).
export const SITE_URL = 'https://d2matic.fr';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  // URLs sans slash final : /services/mon-offre (servi par Vercel via cleanUrls).
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
