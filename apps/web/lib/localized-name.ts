import type { Language } from '@brickninja-org/database';

export interface LocalizedEntity {
  name_de: string;
  name_en: string;
  name_es: string;
  name_fr: string;
  name_nl: string;
}

export function localizedName(entity: LocalizedEntity, language: Language): string {
  return entity[`name_${language}`];
}

export const compareLocalizedName = (language: Language) =>
  (a: LocalizedEntity, b: LocalizedEntity) => {
    const nameA = localizedName(a, language);
    const nameB = localizedName(b, language);

    return nameA.localeCompare(nameB, language, { numeric: true, usage: 'sort' });
  };
