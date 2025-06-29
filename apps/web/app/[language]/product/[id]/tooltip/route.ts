import type { Language } from '@brickninja-org/database';
import type { RouteHandler } from '@/lib/next';
import type { Product as ApiProduct } from '@brickninjaapi/types/data/product';

import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { createTooltip } from '@/components/product/ProductTooltip';

const getProductRevision = cache((id: number, language: Language, revisionId?: string) => {
  return revisionId
    ? db.revision.findFirst({ where: { id: revisionId, entity: 'Product' }})
    : db.revision.findFirst({ where: { [`currentProduct_${language}`]: { id }}});
}, ['revision-product'], { revalidate: 60 });

export const GET: RouteHandler<{ id: string }> = async (request, { params }) => {
  const { id, language } = await params;
  const productId = Number(id);

  const { searchParams } = new URL(request.url);
  const revisionId = searchParams.get('revisionId') ?? undefined;

  const revision = await getProductRevision(productId, language, revisionId);

  if (!revision) {
    notFound();
  }

  const data: ApiProduct = JSON.parse(revision.data);
  const tooltip = await createTooltip(data, language);

  return NextResponse.json(tooltip, {
    headers: { 'cache-control': 'public, max-age=3600', 'Vary': 'Origin' },
  });
};
