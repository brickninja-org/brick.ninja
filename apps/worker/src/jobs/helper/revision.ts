import { Prisma, Revision } from '@brickninja-org/database';

import { db } from '../../db';

import { LocalizedObject } from './types';

export async function createRevisions(data: LocalizedObject, revision: Omit<Prisma.RevisionUncheckedCreateInput, 'data' | 'language'>): Promise<LocalizedObject<Revision>> {
  const [en, nl] = await Promise.all([
    db.revision.create({ data: { data: JSON.stringify(data.en), language: 'en', ...revision }}),
    db.revision.create({ data: { data: JSON.stringify(data.nl), language: 'nl', ...revision }}),
  ]);

  return {
    en,
    nl,
  };
}
