import type { Language } from '@brickninja-org/database';
import type { Item } from '@brickninjaapi/types/data/item';

import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/link-properties';
import { db } from '@/lib/prisma';

export const getItem = cache((id: number, language: Language) => {
  return db.item.findUnique({
    where: { id },
    include: {
      history: {
        where: { revision: { language }},
        include: { revision: { select: { id: true, buildId: true, hash: true, type: true, createdAt: true, description: true, language: true }}},
        orderBy: { revision: { createdAt: 'desc' }},
      },
      icon: true,
      designs: { select: { id: true, name: true, type: true, weight: true }},
      products: { select: { ...linkProperties, type: true, subtype: true, pieceCount: true, figureCount: true }},
      contains: { include: { contentItem: { select: { ...linkProperties, type: true, subtype: true }}}},
      _count: { select: { contains: true, containedIn: true, designs: true }},
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
