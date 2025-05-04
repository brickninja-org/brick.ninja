import type { ProcessEntitiesData } from '../helper/process-entities';

import { isEmptyObject } from '@brickninja-org/helper/is';
import { Job } from '../job';
import { Changes, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { db } from '../../db';
import { getNamesWithFallback } from '../helper/helper';
import { loadProducts } from '../helper/load-products';

import rawData from '../../data/products.json';
import { toId } from '../helper/to-id';
import { createIcon } from '../helper/create-icon';

const CURRENT_VERSION = 1;

export const ProductsJob: Job = {
  async run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if (isEmptyObject(data)) {
      return createSubJobs(
        'products',
        () => new Promise((resolve) => resolve(rawData.products.map(toId))) as unknown as Promise<number[]>,
        db.product.findMany,
        CURRENT_VERSION,
      );
    }

    const knownCategoryIds = (await db.category.findMany({ select: { id: true }})).map(toId);

    return processLocalizedEntities(
      data,
      'Product',
      (productId, revisionId) => ({ productId_revisionId: { revisionId, productId }}),
      async (product, version, changes) => {
        const names = getNamesWithFallback(product, product.en.name);
        const iconId = await createIcon(product.en.icon);

        // for new products we check if there are known items include this product
        const items = changes === Changes.New
          ? { connect: await db.item.findMany({ where: { productIds: { has: product.en.id }}, select: { id: true }}) }
          : undefined;

        return {
          ...names,
          iconId,

          type: product.en.type,
          subtype: product.en.details?.type ?? undefined,
          pieceCount: product.en.details?.attributes?.find((a) => a.type === 'pieceCount')?.value ?? undefined,
          minifigureCount: product.en.details?.attributes?.find((a) => a.type === 'minifigureCount')?.value ?? undefined,

          items,

          categoryIds: product.en.categories,
          categories: { connect: product.en.categories.filter((id) => knownCategoryIds.includes(id)).map((id) => ({ id })) },
        };
      },
      db.product.findMany,
      loadProducts,
      (tx, data) => tx.product.create(data),
      (tx, data) => tx.product.update(data),
      CURRENT_VERSION,
    );
  },
};
