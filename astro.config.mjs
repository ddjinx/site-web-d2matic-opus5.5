// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, readdirSync } from 'node:fs';

// Domaine canonique unique : https, sans www. Utilisé partout (canonical, sitemap, JSON-LD, llms.txt).
export const SITE_URL = 'https://d2matic.fr';

/**
 * Pages exclues du sitemap : pages noindex fixes + fichiers Markdown portant `noindex: true`.
 * Les fichiers `draft: true` ne génèrent aucune page, donc rien à exclure pour eux.
 */
function noindexPaths() {
  const paths = ['/404', '/contact/merci'];
  const prefixes = { services: '/services/', 'cas-clients': '/cas-clients/', blog: '/blog/', pages: '/' };
  for (const [dir, prefix] of Object.entries(prefixes)) {
    const base = `./src/content/${dir}`;
    for (const file of readdirSync(base, { recursive: true })) {
      if (!String(file).endsWith('.md')) continue;
      const frontmatter = readFileSync(`${base}/${file}`, 'utf8').split(/^---$/m)[1] ?? '';
      if (/^noindex:\s*true\s*$/m.test(frontmatter)) paths.push(prefix + String(file).replace(/\.md$/, ''));
    }
  }
  return paths;
}
const EXCLUDED = noindexPaths();

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  // URLs sans slash final : /services/mon-offre (servi par Vercel via cleanUrls).
  trailingSlash: 'never',
  build: {
    format: 'file',
    // CSS inline dans chaque page : aucune requête bloquante au rendu.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED.includes(new URL(page).pathname.replace(/\/$/, '') || '/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
