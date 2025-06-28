import type { ProcessEntitiesData } from '../helper/process-entities';
import type { Job } from '../job';

import { isEmptyObject } from '@brickninja-org/helper/is';

import { db } from '../../db';
import { createIcon } from '../helper/create-icon';
import { fetchApi } from '../helper/fetch-api';
import { getNamesWithFallback } from '../helper/helper';
import { loadLocalizedEntities } from '../helper/load-entities';
import { Changes, createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { toId } from '../helper/to-id';

const CURRENT_VERSION = 1;

export const ProductsJob: Job = {
  async run(data: ProcessEntitiesData<number> | Record<string, never>) {
    if (isEmptyObject(data)) {
      return createSubJobs(
        'products',
        () => fetchApi('/v1/products'),
        db.product.findMany,
        CURRENT_VERSION,
      );
    }

    const knownCategoryIds = (await db.category.findMany({ select: { id: true }})).map(toId);

    return processLocalizedEntities(
      data,
      'Product',
      (ids) => loadLocalizedEntities('/v1/products', ids),
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
          pieceCount: product.en.details?.attributes?.find((a) => a.type === 'pieceCount')?.value as number ?? undefined,
          figureCount: product.en.details?.attributes?.find((a) => a.type === 'figureCount')?.value as number ?? undefined,

          items,

          categoryIds: product.en.categories,
          categories: { connect: product.en.categories!.filter((id) => knownCategoryIds.includes(id)).map((id) => ({ id })) },
        };
      },
      db.product.findMany,
      (tx, data) => tx.product.create(data),
      (tx, data) => tx.product.update(data),
      CURRENT_VERSION,
    );
  },
};
