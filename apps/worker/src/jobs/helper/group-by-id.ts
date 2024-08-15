export function groupEntitiesById<T extends { id: string | number }>(entities: T[]): Map<T['id'], T> {
  const map = new Map<T['id'], T>();

  for(const entity of entities) {
    map.set(entity.id, entity);
  }

  return map;
}
