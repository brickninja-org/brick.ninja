import { Item } from '@brickninjaapi/types/data/item';

// import { GetSets } from '@brickset-api/types/data/get-sets';
import { db } from '../../db';
import { queueJobForIds } from '../helper/queue-job-for-ids';
import { Job } from '../job';
import { createMigrator, CURRENT_VERSION } from './migration';
import { toId } from '../helper/to-id';
import { SchemaVersion } from '../helper/schema';

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
      })).map(toId);

      queueJobForIds('items.migrate', idsToUpdate, { priority: 1, batchSize: 1000 });
      return `Queued migration for ${idsToUpdate.length} items`;
    }

    const itemsToMigrate = await db.item.findMany({
      where: { id: { in: ids }},
      include: { current_de: true, current_en: true, current_es: true, current_fr: true, current_nl: true },
    });

    if (itemsToMigrate.length === 0) {
      return 'No items to update';
    }

    const migrate = await createMigrator();

    for (const item of itemsToMigrate) {
      const de: Item<SchemaVersion> = JSON.parse(item.current_de.data);
      const en: Item<SchemaVersion> = JSON.parse(item.current_en.data);
      const es: Item<SchemaVersion> = JSON.parse(item.current_es.data);
      const fr: Item<SchemaVersion> = JSON.parse(item.current_fr.data);
      const nl: Item<SchemaVersion> = JSON.parse(item.current_nl.data);

      const data = await migrate({ de, en, es, fr, nl }, item.version);

      await db.item.update({ where: { id: item.id }, data });
    }

    return `Migrated ${itemsToMigrate.length} items to version ${CURRENT_VERSION}`;
  },
};
