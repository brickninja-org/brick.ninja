import type { SubType, Type, TypeWithSubtype } from './ItemType.types';

type TranslationKey<T extends Type> = T extends TypeWithSubtype ? `${T}.${SubType<T>}` : T;
export type TypeTranslation<T extends Type, S extends SubType<T>> = T extends TypeWithSubtype ? `${'item.type' | 'item.type.short'}.${T}.${S}` | `item.type.${T}` : `item.type.${T}`;

const typeTranslationKeys = ['Container', 'Documentation', 'Element', 'Packaging', 'Product', 'Set'] as const satisfies Type[];
const subtypeTranslationKeys = [
  'Container.Default',
  'Documentation.Instruction',
  'Element.DUPLO', 'Element.LEGO', 'Element.TECHNIC',
  'Packaging.Bag'
] as const satisfies TranslationKey<TypeWithSubtype>[];

export const translations = {
  short: [...typeTranslationKeys.map((key) => `item.type.${key}` as const), ...subtypeTranslationKeys.map((key) => `item.type.short.${key}` as const)],
  type: typeTranslationKeys.map((key) => `item.type.${key}` as const),
  subtype: subtypeTranslationKeys.map(((key) => `item.type.${key}` as const)),
  long: [...typeTranslationKeys.map((key) => `item.type.${key}` as const), ...subtypeTranslationKeys.map(((key) => `item.type.${key}` as const))]
};
