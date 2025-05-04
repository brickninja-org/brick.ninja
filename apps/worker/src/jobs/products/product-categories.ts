import type { ProcessEntitiesData } from '../helper/process-entities';
import { Changes, createSubJobs, processLocalizedEntities } from '../helper/process-entities';

import { isEmptyObject } from '@brickninja-org/helper/is';

import rawData from '../../data/categories.json';
import { loadThemes } from '../helper/load-themes';
import { Job } from '../job';
import { db } from '../../db';
import { Prisma } from '@brickninja-org/database';
import { toId } from '../helper/to-id';

export const ProductCategoriesJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if (isEmptyObject(data)) {
      return createSubJobs(
        'product.categories',
        () => new Promise((resolve) => resolve(rawData.themes.map(toId))) as unknown as Promise<number[]>,
        db.category.findMany,
        CURRENT_VERSION,
      );
    }

    processLocalizedEntities(
      data,
      'ProductCategory',
      (categoryId, revisionId) => ({ categoryId_revisionId: { revisionId, categoryId }}),
      async (category, _, change) => {
        return {
          name_en: category.en.name,
          name_nl: category.nl.name,

          products: change === Changes.New
            ? { connect: await db.product.findMany({ where: { categoryIds: { has: category.en.id }}, select: { id: true }}) }
            : undefined,
        } satisfies Partial<Prisma.CategoryUncheckedCreateInput>;
      },
      db.category.findMany,
      loadThemes,
      (tx, data) => tx.category.create(data),
      (tx, data) => tx.category.update(data),
      CURRENT_VERSION,
    );
  },
};
