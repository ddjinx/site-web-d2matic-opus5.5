# Site vitrine D2matic

Site statique [Astro](https://astro.build) + Tailwind, déployé sur Vercel. Le dépôt est le CMS : chaque page de contenu est un fichier Markdown avec son frontmatter. Aucun JavaScript côté client, aucune base de données, aucun cookie.

## Commandes

```bash
npm install
npm run dev       # serveur local sur http://localhost:4321
npm run build     # build statique dans dist/ (échoue si un lien interne est cassé)
npm run preview   # sert dist/ en local
```

Node 22.12 ou plus récent.

## Arborescence utile

| Chemin | Rôle |
| --- | --- |
| `src/config/site.ts` | Faits de l'entreprise (nom, SIREN, e-mail, titres, outils), URL LinkedIn et `sameAs` du JSON-LD |
| `src/content/services/` | Une page par offre, servie à `/services/<nom-du-fichier>` |
| `src/content/cas-clients/` | Un cas client par fichier, servi à `/cas-clients/<nom-du-fichier>` |
| `src/content/blog/` | Un article par fichier, servi à `/blog/<nom-du-fichier>` |
| `src/content/pages/` | Pages simples servies à la racine : `/a-propos`, `/mentions-legales`, `/confidentialite` |
| `src/content.config.ts` | Schéma (champs autorisés et obligatoires) de chaque collection |
| `src/pages/` | Gabarits : accueil, contact, listes, pages dynamiques, `robots.txt`, `llms.txt` |
| `src/integrations/check-links.mjs` | Vérification des liens internes en fin de build |
| `vercel.json` | URLs propres, sans slash final, redirection `www` vers `https://d2matic.fr` |

Le nom du fichier `.md` devient l'URL : `src/content/services/audit-rgpd.md` donne `/services/audit-rgpd`. Utiliser des minuscules, sans accents, mots séparés par des tirets.

Un champ manquant ou mal typé fait échouer le build avec un message qui nomme le fichier et le champ.

## Champs communs à toutes les collections

| Champ | Obligatoire | Rôle |
| --- | --- | --- |
| `title` | oui | Titre H1 de la page, repris dans `<title>` (suffixe « \| D2matic » ajouté) et `og:title` |
| `description` | oui | Meta description et `og:description`, 150 à 160 caractères conseillés |
| `seoTitle` | non | Remplace le titre dans `<title>` et `og:title` si on veut un titre SEO différent du H1 |
| `canonical` | non | URL canonique absolue, seulement si elle diffère de l'URL de la page |
| `noindex` | non | `true` : page en `noindex` et retirée du sitemap et de `llms.txt` |
| `draft` | non | `true` : aucun fichier généré, la page n'existe pas en ligne |
| `faq` | non | Liste de `question` / `reponse`. Affichée en bas de page et publiée en JSON-LD `FAQPage` |

Exemple de FAQ :

```yaml
faq:
  - question: "Combien de temps dure une mission ?"
    reponse: "Réponse affichée telle quelle sur la page."
```

Le contenu sous le frontmatter est en Markdown. Ne pas mettre de titre `#` (H1) : le gabarit l'affiche déjà depuis `title`. Commencer par des `##` (H2), puis `###` (H3).

## Ajouter un service

Créer `src/content/services/<slug>.md` :

```yaml
---
title: Titre de l'offre (H1)
description: Meta description de 150 à 160 caractères.
accroche: Phrase courte affichée sur l'accueil, la liste des services et sous le H1.
ordre: 3                 # ordre d'affichage, croissant
outils: [Make, n8n]      # badges affichés sur la page
# image: ./images/offre.png   # optionnel, optimisée par Astro (fichier dans src/content/services/images/)
# imageAlt: Description de l'image
# updatedDate: 2026-10-05
---

## Ce que couvre l'offre
…
```

Le service apparaît automatiquement sur l'accueil, sur `/services`, dans le sitemap et dans `llms.txt`, avec le JSON-LD `Service` et `BreadcrumbList`.

## Ajouter un cas client

Dupliquer `src/content/cas-clients/modele.md`, le renommer, remplir les champs avec des informations réelles validées par le client, puis passer `draft: false`.

| Champ | Obligatoire | Rôle |
| --- | --- | --- |
| `client` | oui | Nom du client autorisé par lui, ou formulation anonymisée validée |
| `secteur` | oui | Secteur d'activité |
| `outils` | non | Outils utilisés |
| `services` | non | Slugs des services liés (noms de fichiers de `src/content/services/`, sans `.md`) |
| `publishedDate` | oui | Date de publication, format `AAAA-MM-JJ` |
| `updatedDate` | non | Date de mise à jour, affichée si présente |
| `image`, `imageAlt` | non | Image optimisée par Astro (fichier dans `src/content/cas-clients/images/`) |

Dès le premier cas publié, la page `/cas-clients`, le lien de navigation et la section de l'accueil apparaissent. Tant qu'aucun cas n'est publié, ils n'existent pas.

## Ajouter un article

Dupliquer `src/content/blog/modele.md`, le renommer, rédiger, puis passer `draft: false`.

| Champ | Obligatoire | Rôle |
| --- | --- | --- |
| `publishedDate` | oui | Date de publication, format `AAAA-MM-JJ` |
| `updatedDate` | non | Date de mise à jour. Affichée en tête d'article (à défaut, la date de publication) et reprise en `dateModified` |
| `resume` | non | Résumé affiché en encadré en tête d'article. Absent ou vide : rien ne s'affiche |
| `tags` | non | Mots-clés (non affichés pour l'instant) |
| `image`, `imageAlt` | non | Image optimisée par Astro (fichier dans `src/content/blog/images/`), aussi utilisée comme image Open Graph |

Chaque article affiche l'encadré auteur (nom, rôle, lien vers `/a-propos` et vers LinkedIn) et porte le JSON-LD `Article`. L'URL LinkedIn se règle dans `src/config/site.ts` (`PERSON.linkedin`) ; tant qu'elle ne commence pas par `https://`, un placeholder visible s'affiche à la place du lien.

La page `/blog` et le lien de navigation apparaissent dès le premier article publié.

## Ajouter une page simple

Créer `src/content/pages/<slug>.md` avec `title` et `description`. Elle est servie à `/<slug>`. Le champ `type: profil` est réservé à la page À propos (bloc identité et JSON-LD `ProfilePage`).

## Placeholders

Tout contenu non fourni est écrit `[À RÉDIGER : …]`, visible sur la page. Pour les retrouver :

```bash
grep -rn "À RÉDIGER" src/
```

## Formulaire de contact

Le formulaire (HTML pur, sans JS) est posté en `application/x-www-form-urlencoded` vers un webhook Make dont l'URL vient de la variable d'environnement `PUBLIC_CONTACT_WEBHOOK`.

- Vercel : Settings > Environment Variables > `PUBLIC_CONTACT_WEBHOOK` = URL du webhook Make, puis redéployer (la valeur est lue au build).
- En local : copier `.env.example` en `.env` et la renseigner.
- Sans la variable, le formulaire est désactivé et un avertissement visible s'affiche.

Champs reçus par Make : `nom`, `email`, `entreprise`, `message`, `site_web`. `site_web` est un pot de miel anti-spam invisible : filtrer le scénario pour ignorer les envois où il est rempli.

Fin du scénario : un module « Webhook response » avec le statut `303` et l'en-tête `Location: https://d2matic.fr/contact/merci`, pour renvoyer le visiteur vers la page de confirmation. Sans ce module, le navigateur affiche la réponse brute de Make.

## Déploiement Vercel

1. Importer le dépôt dans Vercel (framework détecté : Astro, sortie `dist/`).
2. Ajouter les domaines `d2matic.fr` (principal) et `www.d2matic.fr`. La redirection 301 de `www` vers `https://d2matic.fr` est déclarée dans `vercel.json`.
3. Renseigner `PUBLIC_CONTACT_WEBHOOK`.

## SEO et GEO

- Domaine canonique unique `https://d2matic.fr`, sans `www`, sans slash final, utilisé dans les canonical, le sitemap, le JSON-LD et `llms.txt` (`src/config/site.ts` et `astro.config.mjs`).
- `sitemap-index.xml` généré au build, sans les pages `noindex`.
- `robots.txt` généré depuis `src/pages/robots.txt.ts` : robots de recherche IA et d'entraînement autorisés.
- `llms.txt` généré depuis les collections (`src/pages/llms.txt.ts`). Google Search ne l'utilise pas.
- JSON-LD : `ProfessionalService` et `Person` sur l'accueil, `ProfilePage` sur `/a-propos`, `Service`, `Article`, `FAQPage` selon la page, `BreadcrumbList` sur toutes les pages sauf l'accueil. Profils publics de David à ajouter dans `PERSON.sameAs` (`src/config/site.ts`) : ils s'affichent aussi sur l'accueil et la page À propos.
