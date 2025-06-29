import type { Prisma } from '@brickninja-org/database';

export function appendHistory<T extends { history?: { createMany?: { data: Prisma.Enumerable<{ revisionId: string }> }}}>(update: T, revisionId: string) {
  return {
    ...update.history,
    createMany: { ...update.history?.createMany, data: [...enumerableToArray(update.history?.createMany?.data), { revisionId }] }
  };
}

export function enumerableToArray<T>(enumerable: Prisma.Enumerable<T> = []): T[] {
  return Array.isArray(enumerable) ? enumerable : [enumerable];
}
