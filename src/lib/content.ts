import { getCollection, type CollectionKey } from 'astro:content';

/** Entrées publiées d'une collection : les fichiers draft: true sont exclus du build. */
export async function getPublished<C extends CollectionKey>(collection: C) {
  return getCollection(collection, ({ data }) => !data.draft);
}

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

export const isoDate = (date: Date) => date.toISOString().slice(0, 10);
