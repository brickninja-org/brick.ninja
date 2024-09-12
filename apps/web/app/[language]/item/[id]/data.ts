import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import type { Language } from '@brickninja-org/database';

export const getItem = cache((id: number, language: Language) => {
  return db.item.findUnique({
    where: { id },
    include: {
      history: {
        where: { revision: { language }},
        include: { revision: { select: { id: true, createdAt: true, description: true, language: true }}},
        orderBy: { revision: { createdAt: 'desc' }},
      },
    }
  });
}, ['item'], { revalidate: 60 });

export const getRevision = cache(async (id: number, language: Language, revisionId?: string) => {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentItem_${language}`]: { id }}});
  
  return {
    revision,
    data: revision ? JSON.parse(revision.data) : undefined,
  };
}, ['revision-item'], { revalidate: 60 });
