import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { publicApi } from '..';

const maxAge = 60;

const getData = cache(async () => {
  const products = await db.product.findMany({
    select: { id: true },
    orderBy: { id: 'asc' },
  });

  const ids = products.map(({ id }) => id);

  return { json: ids };
}, ['api/products'], { revalidate: maxAge });

export const GET = publicApi(
  '/products',
  getData,
  { maxAge },
);
