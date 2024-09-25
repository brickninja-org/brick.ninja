import type { TypeTranslation } from './item-type.translations';
import type { SubType, Type, TypeWithSubtype } from './item-type.types';

export interface ItemTypeProps<T extends Type, S extends SubType<T>> {
  type: T,
  subtype: S,
  display?: 'short' | 'long',
  translations: Record<TypeTranslation<T, S>, string>
}

export function ItemType<T extends Type, S extends SubType<T>>({ type, subtype, translations, display = 'short' }: ItemTypeProps<T, S>) {
  if(display === 'short') {
    return hasSubtype(type, subtype) ? translations[`item.type.short.${type}.${subtype}` as keyof typeof translations] : translations[`item.type.${type}` as keyof typeof translations];
  }

  return hasSubtype(type, subtype) ? `${translations[`item.type.${type}` as keyof typeof translations]} (${translations[`item.type.${type}.${subtype}` as keyof typeof translations]})` : translations[`item.type.${type}` as keyof typeof translations];
}

function hasSubtype<T extends Type>(type: T | Type, subtype: SubType<T>): type is TypeWithSubtype {
  return subtype !== null;
}
