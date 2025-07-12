import type { LocalizedEntity } from './localized-name';
import type { WithIcon } from './with';

export const linkPropertiesBase = { id: true, icon: true, name_de: true, name_en: true, name_es: true, name_fr: true, name_nl: true } as const;
export const linkProperties = { ...linkPropertiesBase } as const;

export function getLinkProperties<T extends WithIcon<LocalizedEntity> & { id: unknown }>(value: T): WithIcon<LocalizedEntity> & { id: T['id'] };
export function getLinkProperties(
  { id, name_de, name_en, name_es, name_fr, name_nl, icon }: WithIcon<LocalizedEntity> & { id: unknown },
) {
  return { id, name_de, name_en, name_es, name_fr, name_nl, icon };
}
