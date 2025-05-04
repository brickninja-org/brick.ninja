import { db } from '@/lib/prisma';
import { publicApi } from '..';
import { cache } from '@/lib/cache';

const maxAge = 60;

const getData = cache(async ({ type, subtype, containerContents }) => {
  const items = await db.item.findMany({
    where: {
      type, subtype,
      OR: containerContents ? [{ contains: { some: {}}}] : undefined,
    },
    select: { id: true },
    orderBy: { id: 'asc' },
  });

  const ids = items.map(({ id }) => id);

  return { json: ids };
}, ['api/items'], { revalidate: maxAge });

export const GET = publicApi(
  '/items',
  ({ searchParams: { type, subtype, 'container-contents': containerContents }}) =>
    getData({ type, subtype, containerContents }),
  { maxAge }
);
