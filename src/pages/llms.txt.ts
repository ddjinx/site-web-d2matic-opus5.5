import type { APIRoute } from 'astro';
import { PERSON, SITE } from '../config/site';
import { getPublished } from '../lib/content';
import { absoluteUrl } from '../lib/seo';

/**
 * /llms.txt (format llmstxt.org), généré au build depuis les collections.
 * Google Search ne l'utilise pas : bonus pour d'autres systèmes IA, pas un levier de classement.
 */
export const GET: APIRoute = async () => {
  const services = (await getPublished('services')).sort((a, b) => a.data.ordre - b.data.ordre);
  const cas = await getPublished('cas-clients');
  const posts = (await getPublished('blog')).sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf());
  const pages = await getPublished('pages');

  const link = (title: string, path: string, description?: string) =>
    `- [${title}](${absoluteUrl(path)})${description ? `: ${description}` : ''}`;
  const visible = <T extends { data: { noindex: boolean } }>(list: T[]) => list.filter((e) => !e.data.noindex);

  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.name} est la micro-entreprise de ${PERSON.name} (SIREN ${SITE.siren}). ${PERSON.credentials.join('. ')}.`,
    `Outils : ${SITE.tools.join(', ')}. Contact : ${SITE.email}.`,
    '',
    '## Services',
    '',
    ...visible(services).map((s) => link(s.data.title, `/services/${s.id}`, s.data.description)),
  ];

  if (visible(cas).length) {
    lines.push('', '## Cas clients', '', ...visible(cas).map((c) => link(c.data.title, `/cas-clients/${c.id}`, c.data.description)));
  }
  if (visible(posts).length) {
    lines.push('', '## Blog', '', ...visible(posts).map((p) => link(p.data.title, `/blog/${p.id}`, p.data.description)));
  }

  const main = visible(pages).filter((p) => p.data.type === 'profil');
  const other = visible(pages).filter((p) => p.data.type !== 'profil');
  lines.push(
    '',
    '## À propos',
    '',
    ...main.map((p) => link(p.data.title, `/${p.id}`, p.data.description)),
    link('Contact', '/contact', `Formulaire de contact et adresse e-mail ${SITE.email}.`),
    '',
    '## Optional',
    '',
    ...other.map((p) => link(p.data.title, `/${p.id}`, p.data.description)),
    '',
  );

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
