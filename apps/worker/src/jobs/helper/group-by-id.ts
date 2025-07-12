import type { LocalizedObject } from './types';

export function groupLocalizedEntitiesById<T extends { id: string | number }>(entitiesDe: T[], entitiesEn: T[], entitiesEs: T[], entitiesFr: T[], entitiesNl: T[]): Map<T['id'], LocalizedObject<T>> {
  const map = new Map<T['id'], LocalizedObject<T>>();

  for(const en of entitiesEn) {
    const de = entitiesEn.find(({ id }) => id === en.id);
    const es = entitiesEs.find(({ id }) => id === en.id);
    const fr = entitiesFr.find(({ id }) => id === en.id);
    const nl = entitiesNl.find(({ id }) => id === en.id);

    if (de !== undefined && es !== undefined && fr !== undefined && nl !== undefined) {
      map.set(en.id, { de, en, es, fr, nl });
    }
  }

  return map;
}

export function groupEntitiesById<T extends { id: string | number }>(entities: T[]): Map<T['id'], T> {
  const map = new Map<T['id'], T>();

  for(const entity of entities) {
    map.set(entity.id, entity);
  }

  return map;
}
