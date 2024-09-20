import { GetSets } from '@brickset-api/types/data/get-sets';
import { db } from '../../db';
import { queuedJobsForIds } from '../helper/queued-job-for-ids';
import { Job } from '../job';
import { createMigrator, CURRENT_VERSION } from './migration';

export { CURRENT_VERSION } from './migration';

export const ItemsMigrate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    if (!Array.isArray(ids)) {
      // skip if any follow up jobs are still queued
      const queued = await db.job.count({ where: { type: { in: ['items.migrate'] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if (queued > 0) {
        return 'Waiting for pending follow up jobs';
      }
      const idsToUpdate = (await db.item.findMany({
        where: { version: { lt: CURRENT_VERSION }},
        orderBy: { updatedAt: 'asc' },
        select: { id: true },
      })).map(({ id }) => id);

      queuedJobsForIds('items.migrate', idsToUpdate, { priority: 1, batchSize: 1000 });
      return `Queued migration for ${idsToUpdate.length} items`;
    }

    const itemsToMigrate = await db.item.findMany({
      where: { id: { in: ids }},
      include: { current_en: true, current_nl: true },
    });

    if (itemsToMigrate.length === 0) {
      return 'No items to update';
    }

    const migrate = await createMigrator();

    for (const item of itemsToMigrate) {
      const en: GetSets = JSON.parse(item.current_en.data);
      const nl: GetSets = JSON.parse(item.current_nl.data);

      const data = await migrate({ en, nl }, item.version);

      await db.item.update({ where: { id: item.id }, data });
    }

    return `Migrated ${itemsToMigrate.length} items to version ${CURRENT_VERSION}`;
  },
};
