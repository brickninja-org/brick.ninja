import type { Language } from '@brickninja-org/database';
import type { PublicApiResponse } from 'app/api';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { publicApi } from 'app/api';

const maxId = Math.pow(2, 32) - 1;
const maxAge = 60;

const getData = cache(async (id: number, language: Language): Promise<PublicApiResponse> => {
  const product = await db.product.findFirst({
    where: { id },
    select: {
      createdAt: true,
      current_de: language === 'de' ? { select: { data: true }} : false,
      current_en: language === 'en' ? { select: { data: true }} : false,
      current_es: language === 'es' ? { select: { data: true }} : false,
      current_fr: language === 'fr' ? { select: { data: true }} : false,
      current_nl: language === 'nl' ? { select: { data: true }} : false,
    },
  });

  if (!product) {
    return { error: 404, text: 'Product not found' };
  }

  return {
    stringAsJson: product[`current_${language}`].data,
    header: {
      'X-Created-At': product.createdAt.toISOString(),
    },
  };
}, ['api/products/:id/data'], { revalidate: maxAge });

export const GET = publicApi<'id'>(
  '/products/:id/data',
  ({ language, params: { id }}) => {
    const productId = Number(id);

    // validate productId
    if (isNaN(productId) || productId <= 0 || productId > maxId || productId.toString() !== id) {
      return { error: 400, text: 'Invalid product ID' };
    }

    return getData(productId, language);
  },
  { maxAge },
);
