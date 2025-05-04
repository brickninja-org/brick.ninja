import type { Language } from '@brickninja-org/database';

import { notFound } from 'next/navigation';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';

export const getProduct = cache(async (id: number, language: Language) => {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      history: {
        include: { revision: { select: { id: true, createdAt: true, description: true, language: true }}},
        where: { revision: { language }},
        orderBy: { revision: { createdAt: 'desc' }},
      },
      icon: true,
      categories: true,
    },
  });

  if (!product) {
    notFound();
  }

  return product;
}, ['product'], { revalidate: 60 });

export const getRevision = cache(async (id: number, language: Language, revisionId?: string) => {
  const revision = revisionId
    ? await db.revision.findUnique({ where: { id: revisionId }})
    : await db.revision.findFirst({ where: { [`currentProduct_${language}`]: { id }}});

  return {
    revision,
    data: revision ? JSON.parse(revision.data) : undefined,
  };
}, ['revision-product'], { revalidate: 60 });
