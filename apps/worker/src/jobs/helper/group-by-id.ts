import { LocalizedObject } from './types';

export function groupLocalizedEntitiesById<T extends { id: string | number }>(entitiesEn: T[], entitiesNl: T[]): Map<T['id'], LocalizedObject<T>> {
  const map = new Map<T['id'], LocalizedObject<T>>();

  for(const en of entitiesEn) {
    const nl = entitiesNl.find(({ id }) => id === en.id);

    if (nl !== undefined) {
      map.set(en.id, { en, nl });
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
