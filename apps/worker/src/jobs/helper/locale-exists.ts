import type { LocalizedObject } from './types';

export function localeExists<X, T extends LocalizedObject<X>>(value: Partial<T>): value is T {
  return value.en !== undefined || value.nl !== undefined;
}
