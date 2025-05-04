import type { LocalizedEntity } from './localized-name';
import type { WithIcon } from './with';

export const linkPropertiesBase = { id: true, icon: true, name_en: true, name_nl: true } as const;
export const linkProperties = { ...linkPropertiesBase } as const;

export function getLinkProperties<T extends WithIcon<LocalizedEntity> & { id: unknown }>(value: T): WithIcon<LocalizedEntity> & { id: T['id'] };
export function getLinkProperties(
  { id, name_en, name_nl, icon }: WithIcon<LocalizedEntity> & { id: unknown },
) {
  return { id, name_en, name_nl, icon };
}
