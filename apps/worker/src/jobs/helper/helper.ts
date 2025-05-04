import type { Falsy } from '@brickninja-org/helper/is';
import type { LocalizedObject } from './types';

type Names = {
  name_en: string,
  name_nl: string,
};

export function getNamesWithFallback({ en, nl }: LocalizedObject<{ name?: string }>, fallback?: string | Falsy): Names {
  return {
    name_en: en.name?.trim() ? en.name : (fallback || ''),
    name_nl: nl.name?.trim() ? nl.name : (fallback || ''),
  };
}
