import { LocalizedObject } from "./types";

export function groupLocalizedEntitiesById<T extends { setID: string | number }>(entitiesEn: T[], entitiesNl: T[]): Map<T['setID'], LocalizedObject<T>> {
  const map = new Map<T['setID'], LocalizedObject<T>>();

  for(const en of entitiesEn) {
    const nl = entitiesNl.find(({ setID }) => setID === en.setID);

    if (nl !== undefined) {
      map.set(en.setID, { en, nl });
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
