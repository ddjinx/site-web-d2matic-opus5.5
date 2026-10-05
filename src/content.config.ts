import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Champs SEO communs, pilotés par le frontmatter de chaque fichier. */
const seo = {
  /** Titre H1 de la page, repris dans <title> (suffixe « | D2matic » ajouté automatiquement). */
  title: z.string(),
  /** Meta description, 150 à 160 caractères conseillés. */
  description: z.string(),
  /** Remplace le contenu de <title> et og:title si on veut un titre SEO différent du H1 (optionnel). */
  seoTitle: z.string().optional(),
  /** URL canonique absolue si elle diffère de l'URL de la page (rare, optionnel). */
  canonical: z.url().optional(),
  /** true = page exclue de l'indexation et du sitemap. */
  noindex: z.boolean().default(false),
  /** true = fichier exclu du build (aucune page générée). */
  draft: z.boolean().default(false),
};

const faq = z
  .array(
    z.object({
      question: z.string(),
      reponse: z.string(),
    }),
  )
  .optional();

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      ...seo,
      /** Accroche courte affichée sur l'accueil et la liste des services. */
      accroche: z.string(),
      /** Ordre d'affichage (croissant). */
      ordre: z.number().default(100),
      /** Outils mobilisés, affichés sur la page. */
      outils: z.array(z.string()).default([]),
      image: image().optional(),
      imageAlt: z.string().optional(),
      faq,
      updatedDate: z.coerce.date().optional(),
    }),
});

const casClients = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cas-clients' }),
  schema: ({ image }) =>
    z.object({
      ...seo,
      /** Nom du client tel qu'autorisé par lui (ou formulation anonymisée validée). */
      client: z.string(),
      secteur: z.string(),
      outils: z.array(z.string()).default([]),
      /** Slugs des services liés (fichiers de src/content/services). */
      services: z.array(z.string()).default([]),
      publishedDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      faq,
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      ...seo,
      publishedDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      /** Résumé optionnel affiché en encadré en tête d'article. Vide = rien ne s'affiche. */
      resume: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      faq,
    }),
});

/** Pages simples (à propos, mentions légales, confidentialité…), servies à la racine : /slug. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    ...seo,
    /** "profil" = page À propos : bloc identité + JSON-LD ProfilePage. */
    type: z.enum(['standard', 'profil']).default('standard'),
    updatedDate: z.coerce.date().optional(),
    faq,
  }),
});

export const collections = { services, 'cas-clients': casClients, blog, pages };
