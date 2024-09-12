import type { Language } from '@brickninja-org/database';

export interface LocalizedEntity {
  name_en: string;
  name_nl: string;
}

export function localizeName(entity: LocalizedEntity, language: Language): string {
  return entity[`name_${language}`];
}
