import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

/**
 * Robots de recherche IA (citation des pages dans les réponses) et d'entraînement,
 * autorisés explicitement : choix assumé pour un site vitrine qui cherche la visibilité.
 */
const AI_SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot'];
const AI_TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended'];

export const GET: APIRoute = () => {
  const groups = [
    '# Tous les robots',
    'User-agent: *',
    'Allow: /',
    '',
    '# Robots de recherche IA',
    ...AI_SEARCH_BOTS.map((bot) => `User-agent: ${bot}`),
    'Allow: /',
    '',
    '# Robots d’entraînement IA (autorisés volontairement)',
    ...AI_TRAINING_BOTS.map((bot) => `User-agent: ${bot}`),
    'Allow: /',
    '',
    `Sitemap: ${SITE.url}/sitemap-index.xml`,
    '',
  ];
  return new Response(groups.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
