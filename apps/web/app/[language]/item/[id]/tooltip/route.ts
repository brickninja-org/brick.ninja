import type { Language } from '@brickninja-org/database';
// import type { GetSets } from '@brickset-api/types/data/get-sets';
import type { RouteHandler } from '@/lib/next';
import type { Item } from '@brickninjaapi/types/data/item';

import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { createTooltip } from '@/components/item/ItemTooltip';

const getItemRevision = cache(function (id: number, language: Language, revisionId?: string) {
  return revisionId
    ? db.revision.findFirst({ where: { id: revisionId, entity: 'Item' }})
    : db.revision.findFirst({ where: { [`currentItem_${language}`]: { id }}});
}, ['item-tooltip'], { revalidate: 60 });

export const GET: RouteHandler<{ id: string }> = async (request, { params }) => {
  const { language, id } = await params;
  const itemId = Number(id);

  const { searchParams } = new URL(request.url);
  const revisionId = searchParams.get('revision') ?? undefined;

  const revision = await getItemRevision(itemId, language, revisionId);

  if(!revision) {
    notFound();
  }

  const data: Item = JSON.parse(revision.data);
  const tooltip = await createTooltip(data, language);

  return NextResponse.json(tooltip, {
    headers: { 'cache-control': 'public, max-age=3600', 'Vary': 'Origin' }
  });
};
