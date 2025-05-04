import type { Language } from '@brickninja-org/database';
import type { Item } from 'types/item';

import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/link-properties';
import { db } from '@/lib/prisma';

export const getItem = cache((id: number, language: Language) => {
  return db.item.findUnique({
    where: { id },
    include: {
      history: {
        where: { revision: { language }},
        include: { revision: { select: { id: true, createdAt: true, description: true, language: true }}},
        orderBy: { revision: { createdAt: 'desc' }},
      },
      icon: true,
      products: { select: { ...linkProperties, type: true, subtype: true, pieceCount: true }},
      contains: { include: { contentItem: { select: { ...linkProperties, type: true, subtype: true }}}},
      _count: { select: { contains: true, containedIn: true }},
    }
  });
}, ['item'], { revalidate: 60 });

export const getRevision = cache(async (id: number, language: Language, revisionId?: string) => {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentItem_${language}`]: { id }}});

  return {
    revision,
    data: revision ? JSON.parse(revision.data) as Item : undefined,
  };
}, ['revision-item'], { revalidate: 60 });
