import type { Job } from '../job';

import { db } from '../../db';

export const ItemsRelevancy: Job = {
  run: async () => {
    // get the max views over all items
    const [{ maxViews }] = await db.$queryRaw<[{ maxViews: number }]>`
      SELECT
        MAX(views) as "maxViews"
      FROM "Item";`;

    console.log('   max views:', maxViews);

    // upate relevancy to the average of the normalized views
    // we need to cast to float, otherwise the result will be rounded to integer
    // views is weighted
    const updated = await db.$executeRaw`
      UPDATE "Item"
      SET relevancy = (
        ("views" * 2.0 / ${maxViews})
      ) / 4`;

    return `Updated relevancy scores of ${updated} items`;
  },
};
