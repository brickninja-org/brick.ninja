import { Prisma } from '@brickninja-org/database';
import { isTruthy } from '@brickninja-org/helper/is';

import { db } from '../../db';
import { queueJobForIds } from '../helper/queue-job-for-ids';
import { toId } from '../helper/to-id';
import { Job } from '../job';

// import data from '../../data/item-contents.json';
import { fetchApi } from '../helper/fetch-api';

export const ItemContainerContent: Job = {
  run: async (ids: number[] | undefined) => {
    if (!Array.isArray(ids)) {
      const containerIds = await db.item.findMany({
        where: {
          OR: [{ type: 'Container' }],
          contains: { none: {}},
        },
        select: { id: true },
      });

      await queueJobForIds('items.container-content', containerIds.map(toId));

      return `Queued jobs for ${containerIds.length} containers`;
    }

    const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);

    let inserts = 0;

    for (const id of ids) {
      const productId = await db.product.findFirst({ where: { items: { some: { id }}}, select: { id: true }}).then((product) => product?.id);
      if (!productId) {
        console.warn(`No product found for container item ${id}`);
        continue;
      }

      const results = await fetchApi(`/v1/products/${productId}/inventory-list`);

      if (!results || !results.items || !Array.isArray(results.items) || results.items.length === 0) {
        console.warn(`No contents found for container ${id}`);
        continue;
      }

      // const results = data.contents.filter(({ containerId }) => containerId === id);
      const contents = Object.values(results.items).map<Prisma.ContentCreateManyInput>((entry) => ({
        containerItemId: id,
        contentItemId: Number(entry.item_id),
        quantity: entry.quantity,
      })).filter((content) => isTruthy(content.contentItemId) && isTruthy(content.quantity) && knownItemIds.includes(content.contentItemId));

      const created = await db.content.createMany({
        data: contents,
        skipDuplicates: true,
      });

      inserts += created.count;
    }

    return `Inserted ${inserts} contents`;
  }
};
