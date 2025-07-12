import type { Language } from '@brickninja-org/database';
import { publicApi, type PublicApiResponse } from 'app/api';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { isDefined } from '@brickninja-org/helper/is';

const maxProductId = Math.pow(2, 31) - 1; // 2^31 - 1 = 2147483647
const maxAge = 60 * 60; // 1 hour

const getData = cache(async (ids: number[], language: Language): Promise<PublicApiResponse> => {
  const products = await db.product.findMany({
    where: { id: { in: ids }},
    select: {
      current_de: language === 'de' ? { select: { data: true }} : false,
      current_en: language === 'en' ? { select: { data: true }} : false,
      current_es: language === 'es' ? { select: { data: true }} : false,
      current_fr: language === 'fr' ? { select: { data: true }} : false,
      current_nl: language === 'nl' ? { select: { data: true }} : false,
    },
  });

  return {
    stringAsJson: `[${products.map((product) => product[`current_${language}`].data).join(',')}]`,
    status: products.length === 0 ? 404 : products.length < ids.length ? 206 : 200,
  };
}, ['api/products/bulk/data'], { revalidate: maxAge });

export const GET = publicApi(
  '/products/bulk/data',
  ({ language, searchParams: { ids }}) => {
    if (!ids) {
      return { error: 400, text: 'Missing `ids` query parameter' };
    }

    const rawIds = ids.split(',');

    if (rawIds.length > 1000) {
      return { error: 400, text: 'Only 1000 ids allowed' };
    }

    const productIds = rawIds.map((id) => {
      const numericId = Number(id);
      return (isNaN(numericId) || numericId <= 0 || numericId > maxProductId || numericId.toString() !== id) ? undefined : numericId;
    }).filter(isDefined);

    return getData(productIds, language);
  },
);
