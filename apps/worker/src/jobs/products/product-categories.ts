import type { ProcessEntitiesData } from '../helper/process-entities';
import { Changes, createSubJobs, processLocalizedEntities } from '../helper/process-entities';

import { isEmptyObject } from '@brickninja-org/helper/is';

import { Job } from '../job';
import { db } from '../../db';
import { Prisma } from '@brickninja-org/database';
import { fetchApi } from '../helper/fetch-api';
import { loadLocalizedEntities } from '../helper/load-entities';

export const ProductCategoriesJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if (isEmptyObject(data)) {
      return createSubJobs(
        'product.categories',
        () => fetchApi('/v1/products/categories'),
        db.productCategory.findMany,
        CURRENT_VERSION,
      );
    }

    processLocalizedEntities(
      data,
      'ProductCategory',
      (ids) => loadLocalizedEntities('/v1/products/categories', ids),
      (productCategoryId, revisionId) => ({ productCategoryId_revisionId: { revisionId, productCategoryId }}),
      async (category, _, change) => {
        return {
          name_de: category.de.name,
          name_en: category.en.name,
          name_es: category.es.name,
          name_fr: category.fr.name,
          name_nl: category.nl.name,

          products: change === Changes.New
            ? { connect: await db.product.findMany({ where: { categoryIds: { has: category.en.id }}, select: { id: true }}) }
            : undefined,
        } satisfies Partial<Prisma.ProductCategoryUncheckedCreateInput>;
      },
      db.productCategory.findMany,
      (tx, data) => tx.productCategory.create(data),
      (tx, data) => tx.productCategory.update(data),
      CURRENT_VERSION,
    );
  },
};
