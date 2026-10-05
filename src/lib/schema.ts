/**
 * Fabriques JSON-LD schema.org. Règle : ne reprendre que ce qui est visible sur la page.
 */
import { PERSON, SITE } from '../config/site';
import { ORG_ID, PERSON_ID, absoluteUrl } from './seo';
import { isoDate } from './content';

type Faq = { question: string; reponse: string }[] | undefined;

/** Référence légère à l'organisation (pages autres que l'accueil). */
export const orgRef = () => ({ '@type': 'ProfessionalService', '@id': ORG_ID, name: SITE.name, url: SITE.url });
export const personRef = () => ({ '@type': 'Person', '@id': PERSON_ID, name: PERSON.name, url: absoluteUrl('/a-propos') });

export function professionalService() {
  return {
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    founder: { '@id': PERSON_ID },
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'Place', name })),
    knowsAbout: [...SITE.tools],
  };
}

export function person() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON.name,
    jobTitle: PERSON.jobTitle,
    url: absoluteUrl('/a-propos'),
    worksFor: { '@id': ORG_ID },
    alumniOf: PERSON.alumniOf.map((name) => ({ '@type': 'EducationalOrganization', name })),
    // Profils publics officiels : à remplir dans src/config/site.ts (PERSON.sameAs).
    sameAs: [...PERSON.sameAs],
  };
}

export function profilePage(path: string, dateModified?: Date) {
  return {
    '@type': 'ProfilePage',
    '@id': `${absoluteUrl(path)}#page`,
    url: absoluteUrl(path),
    ...(dateModified && { dateModified: isoDate(dateModified) }),
    mainEntity: person(),
  };
}

export function service(data: { title: string; description: string; outils: string[] }, path: string) {
  return {
    '@type': 'Service',
    '@id': `${absoluteUrl(path)}#service`,
    name: data.title,
    description: data.description,
    url: absoluteUrl(path),
    serviceType: data.title,
    provider: orgRef(),
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'Place', name })),
    audience: { '@type': 'BusinessAudience', audienceType: SITE.audience.join(', ') },
  };
}

export function article(
  data: { title: string; description: string; publishedDate: Date; updatedDate?: Date },
  path: string,
  image?: string,
) {
  return {
    '@type': 'Article',
    '@id': `${absoluteUrl(path)}#article`,
    headline: data.title,
    description: data.description,
    datePublished: isoDate(data.publishedDate),
    dateModified: isoDate(data.updatedDate ?? data.publishedDate),
    mainEntityOfPage: absoluteUrl(path),
    inLanguage: 'fr-FR',
    author: personRef(),
    publisher: orgRef(),
    ...(image && { image: new URL(image, SITE.url).href }),
  };
}

export function faqPage(faq: Faq) {
  if (!faq?.length) return [];
  return [
    {
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.reponse },
      })),
    },
  ];
}
