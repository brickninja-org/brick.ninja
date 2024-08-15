import type { Prisma } from '@brickninja-org/database';
import { db, type PrismaTransaction } from '../../db';

export function createRevision(data: Prisma.RevisionUncheckedCreateInput, tx: PrismaTransaction) {
  return (tx ?? db).revision.create({ data, select: { id: true }});
}
