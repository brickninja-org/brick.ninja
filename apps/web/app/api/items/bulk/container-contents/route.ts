import type { PublicApiResponse } from 'app/api';

import { isDefined } from '@brickninja-org/helper/is';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { publicApi } from 'app/api';

const maxAge = 60 * 60;

const getData = cache(async (ids: number[]): Promise<PublicApiResponse> => {
  const items = await db.item.findMany({
    where: { id: { in: ids }, OR: [{ contains: { some: {}}}] },
    select: {
      id: true,
      contains: { select: { contentItemId: true, quantity: true }},
    },
  });

  return {
    json: items.map(({ id, contains }) => ({
      id,
      contents: [
        ...contains.map(({ contentItemId: id, quantity }) => ({ type: 'Item', id, quantity })),
      ],
    })),
    status: items.length === 0 ? 404 : items.length < ids.length ? 206 : 200,
  };
}, ['/api/items/bulk/container-contents'], { revalidate: maxAge });

export const GET = publicApi(
  '/items/bulk/container-contents',
  ({ searchParams: { ids }}) => {
    if (!ids) {
      return { error: 400, text: 'Missing `ids` query parameter' };
    }

    const rawIds = ids.split(',');

    if (rawIds.length > 1000) {
      return { error: 400, text: 'Only 1000 `ids` allowed' };
    }

    const itemIds = rawIds.map((id) => {
      const numericId = Number(id);
      return (isNaN(numericId) || numericId <= 0 || numericId.toString() !== id) ? undefined : numericId;
    }).filter(isDefined);

    return getData(itemIds);
  },
  { maxAge },
);
