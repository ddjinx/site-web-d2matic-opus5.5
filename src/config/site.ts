/**
 * Données de l'entreprise, réutilisées dans les gabarits, le JSON-LD et llms.txt.
 * Ne contient que des faits fournis. Tout le reste est un placeholder [À RÉDIGER : …].
 */
export const SITE = {
  name: 'D2matic',
  url: 'https://d2matic.fr',
  locale: 'fr_FR',
  lang: 'fr',
  email: 'contact@d2matic.fr',
  siren: '988 923 553',
  legalForm: 'Micro-entreprise',
  tagline: 'Consultant en automatisation no-code et low-code',
  description:
    'D2matic, consultant en automatisation no-code et low-code, Make Expert Partner. Automatisations conformes RGPD pour TPE, PME, agences et équipes opérationnelles d’ETI, en France et en Europe.',
  areaServed: ['France', 'Europe'],
  audience: ['TPE', 'PME', 'agences', 'équipes opérationnelles d’ETI'],
  tools: ['Make', 'n8n', 'Airtable', 'SeaTable', 'Notion', 'Softr', 'IA générative'],
  defaultOgImage: '/og-default.png',
} as const;

export const PERSON = {
  name: 'David Dupont',
  jobTitle: 'Consultant en automatisation no-code et low-code',
  credentials: [
    'Make Expert Partner',
    'Titre RNCP niveau 6 Product Builder (École Cube Paris)',
    'Ingénieur Grenoble INP ENSE3',
    'Ancien Directeur des Opérations et DPO',
  ],
  alumniOf: ['Grenoble INP ENSE3', 'École Cube Paris'],
  /**
   * URL du profil LinkedIn. Tant qu'elle ne commence pas par https://, le lien
   * n'est pas rendu et un placeholder visible s'affiche à la place.
   */
  linkedin: '[À RÉDIGER : URL du profil LinkedIn de David Dupont]',
  /**
   * Profils publics officiels (LinkedIn, Malt, annuaire Make Partner…), repris
   * dans le JSON-LD Person. À remplir avec des URL complètes.
   */
  sameAs: [] as string[],
} as const;

export const hasUrl = (value: string) => /^https?:\/\//.test(value);
