import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Fait échouer le build si un lien interne (href/src) pointe vers une page ou un fichier
 * absent de la sortie. Interne = chemin relatif, chemin absolu « /… » ou URL du site.
 */
export default function checkLinks({ site }) {
  return {
    name: 'check-internal-links',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const htmlFiles = readdirSync(root, { recursive: true })
          .map(String)
          .filter((f) => f.endsWith('.html'));

        const exists = (pathname) => {
          const p = decodeURIComponent(pathname).replace(/^\/+/, '');
          if (p === '') return existsSync(join(root, 'index.html'));
          const clean = p.replace(/\/+$/, '');
          return [clean, `${clean}.html`, join(clean, 'index.html')].some((c) => existsSync(join(root, c)));
        };

        const broken = [];
        for (const file of htmlFiles) {
          const html = readFileSync(join(root, file), 'utf8');
          // URL de la page, pour résoudre les liens relatifs.
          const pageUrl = new URL('/' + file.split('\\').join('/').replace(/(index)?\.html$/, ''), site);
          for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
            const value = raw.trim().replace(/&amp;/g, '&');
            if (!value || value.startsWith('#') || /^(mailto|tel|javascript|data):/i.test(value)) continue;
            let url;
            try {
              url = new URL(value, pageUrl);
            } catch {
              broken.push(`${file} : ${attr}="${raw}" (URL invalide)`);
              continue;
            }
            if (url.origin !== new URL(site).origin) continue; // lien externe
            if (!exists(posix.normalize(url.pathname))) broken.push(`${file} : ${attr}="${raw}"`);
          }
        }

        if (broken.length) {
          throw new Error(`Liens internes cassés (${broken.length}) :\n  - ${broken.join('\n  - ')}`);
        }
        logger.info(`${htmlFiles.length} pages vérifiées, aucun lien interne cassé.`);
      },
    },
  };
}
