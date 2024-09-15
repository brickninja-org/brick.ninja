import type { LocalizedEntity } from './localized-name';

export const linkPropertiesBase = { id: true, name_en: true, name_nl: true } as const;
export const linkProperties = { ...linkPropertiesBase } as const;

export function getLinkProperties<T extends LocalizedEntity & { id: unknown }>(value: T): LocalizedEntity & { id: T['id'] };
export function getLinkProperties(
  { id, name_en, name_nl }: LocalizedEntity & { id: unknown },
) {
  return { id, name_en, name_nl };
}
