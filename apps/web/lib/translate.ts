import 'server-only';

import type { Language } from '@brickninja-org/database';

import { headers } from 'next/headers';

import en from '../dictionary/en.json';
import nl from '../dictionary/nl.json';

export type TranslationId = keyof typeof en;

export type TranslationSubset<T extends TranslationId> = Record<T, string>;

const dictionaryNl: Record<TranslationId, string> = { ...en, ...nl };

const getDictionary = (language: Language): Record<TranslationId, string> => {
  switch(language) {
    case 'en': return en;
    case 'nl': return dictionaryNl;
  }
};

export function getTranslate(language: Language) {
  const messages = getDictionary(language);

  return (id: TranslationId) => {
    return messages[id] ?? '[Missing translation: ' + id + ']';
  };
}

export function translate(id: TranslationId, language: Language) {
  const translate = getTranslate(language);

  return translate(id);
}

export function translateMany<T extends TranslationId>(ids: T[], language: Language): TranslationSubset<T> {
  const translate = getTranslate(language);

  return Object.fromEntries(ids.map((id) => [id, translate(id)])) as TranslationSubset<T>;
}

export async function getLanguage() {
  // TODO: use getRootParams once those are supported
  const language = (await headers()).get('x-bn-lang') as Language;

  return language;
}
