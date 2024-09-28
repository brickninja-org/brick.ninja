import { isTruthy } from '@brickninja-org/helper/is';
import { db } from '../../db';
import { loadItems } from '../helper/load-items';
import { localeExists } from '../helper/locale-exists';
import { queuedJobsForIds } from '../helper/queued-job-for-ids';
import { Job } from '../job';
import { createMigrator } from './migration';

export const ItemsUpdate: Job = {
  run: async (ids: number[] | Record<string, never>) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 5);

    if (!Array.isArray(ids)) {
      // skip if any folluw up jobs are still queued
      const queuedJobs = await db.job.count({ where: { type: { in: ['items.update' ] }, state: { in: ['Queued', 'Running'] }, cron: null }});

      if (queuedJobs > 0) {
        return 'Waiting for pending follow up jobs';
      }

      const idsToUpdate = (await db.item.findMany({
        where: { lastCheckedAt: { lt: sevenDaysAgo }, removedFromApi: false },
        orderBy: { lastCheckedAt: 'asc' },
        select: { id: true },
      })).map(({ id }) => id);

      await queuedJobsForIds('items.update', idsToUpdate, { priority: 1 });
      return `Queued update for ${idsToUpdate.length} items`;
    }

    const itemsToUpdate = await db.item.findMany({
      where: { id: { in: ids }},
      orderBy: { lastCheckedAt: 'asc' },
      include: { current_en: true, current_nl: true },
      take: 50,
    });

    console.log(`Updating ${itemsToUpdate.length} items`);

    if (itemsToUpdate.length === 0) {
      return 'No items to update';
    }

    // load items from API
    const apiItems = await loadItems(itemsToUpdate.map(({ productCode }) => productCode).filter(isTruthy));

    console.log(`Loaded ${apiItems.size} items from API`);

    const items = itemsToUpdate.map((existing) => ({
      existing,
      ...apiItems.get(existing.id),
    })).filter(localeExists);

    console.log(`Processing ${items.length} items`);

    const migrate = await createMigrator();

    let updatedItems = 0;

    for(const { existing, en, nl } of items) {
      const changed_en = existing.current_en.data !== JSON.stringify(en);
      const changed_nl = existing.current_nl.data !== JSON.stringify(nl);

      if (!changed_en && !changed_nl) {
        // nothing changed
        await db.item.update({ data: { lastCheckedAt: new Date() }, where: { id: existing.id }});
        continue;
      }

      const revision_en = changed_en ? await db.revision.create({ data: { data: JSON.stringify(en), language: 'en', type: 'Updated', entity: 'Item', description: 'Updated in API', previousRevisionId: existing.currentId_en }}) : existing.current_en;
      const revision_nl = changed_nl ? await db.revision.create({ data: { data: JSON.stringify(nl), language: 'nl', type: 'Updated', entity: 'Item', description: 'Updated in API', previousRevisionId: existing.currentId_nl }}) : existing.current_nl;

      const data = await migrate({ en, nl });

      await db.item.update({
        where: { id: existing.id },
        data: {
          name_en: en.name,
          name_nl: nl.name,

          ...data,

          currentId_en: revision_en.id,
          currentId_nl: revision_nl.id,
          lastCheckedAt: new Date(),
          history: { createMany: { data: [{ revisionId: revision_en.id }, { revisionId: revision_nl.id }], skipDuplicates: true }}
        }
      });

      updatedItems++;
    }

    return `Updated ${updatedItems}/${items.length} items`;
  }
};
