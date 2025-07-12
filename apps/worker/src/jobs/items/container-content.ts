import { Prisma } from '@brickninja-org/database';
import { isTruthy } from '@brickninja-org/helper/is';

import { db } from '../../db';
import { queueJobForIds } from '../helper/queue-job-for-ids';
import { toId } from '../helper/to-id';
import { Job } from '../job';

import data from '../../data/item-contents.json';

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
      const results = data.contents.filter(({ containerId }) => containerId === id);
      const contents = Object.values(results).map<Prisma.ContentCreateManyInput>((entry) => ({
        containerItemId: id,
        contentItemId: entry.contentItemId,
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
