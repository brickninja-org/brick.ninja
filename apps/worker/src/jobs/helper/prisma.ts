import { Prisma } from '@brickninja-org/database';

export function enumerableToArray<T>(enumerable: Prisma.Enumerable<T> = []): T[] {
  return Array.isArray(enumerable) ? enumerable : [enumerable];
}
