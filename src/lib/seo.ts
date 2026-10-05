import { SITE } from '../config/site';

/** URL absolue canonique : https, sans www, sans slash final ni extension .html. */
export function absoluteUrl(path: string): string {
  let p = path.replace(/\.html$/, '').replace(/\/index$/, '');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return new URL(p || '/', SITE.url).href;
}

export const ORG_ID = `${SITE.url}/#organisation`;
export const PERSON_ID = `${SITE.url}/#david-dupont`;
