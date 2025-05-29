import { Prisma } from '@brickninja-org/database';

import { enumerableToArray } from './prisma';

export function appendHistory<T extends { history?: { createMany?: { data: Prisma.Enumerable<{ revisionId: string }> }}}>(update: T, revisionId: string) {
  return {
    ...update.history,
    createMany: { ...update.history?.createMany, data: [...enumerableToArray(update.history?.createMany?.data), { revisionId }] }
  };
}
