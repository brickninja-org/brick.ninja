import { db, dbDebug } from '../../db';
import { fetchApi } from '../helper/fetch-api';
import { queuedJobsForIds } from '../helper/queued-job-for-ids';
import { Job } from '../job';

export const ItemsCheck: Job = {
  run: async () => {
    dbDebug.log = true;

    // skip if any follow up jobs are still queued
    const queuedJobs = await db.job.count({ where: { type: { in: ['items.new', 'items.removed', 'items.rediscovered'] }, state: { in: ['Queued', 'Running'] }}});

    if (queuedJobs > 0) {
      return 'Waiting for pending follow up jobs';
    }

    // get item ids from the API
    const ids = await fetchApi('/v1/items');

    // get item ids from the DB
    const knownIds = await db.item.findMany({ select: { id: true }}).then((items) => items.map(({ id }) => id));
    const knownRemovedIds = await db.item.findMany({ select: { id: true }, where: { removedFromApi: true }}).then((items) => items.map(({ id }) => id));

    // Build new ids
    const newIds = ids.filter((id) => !knownIds.includes(id));
    const removedIds = knownIds.filter((id) => !ids.includes(id) && !knownRemovedIds.includes(id));
    const rediscoveredIds = knownRemovedIds.filter((id) => ids.includes(id));

    await queuedJobsForIds('items.new', newIds);
    await queuedJobsForIds('items.removed', removedIds);
    await queuedJobsForIds('items.rediscovered', rediscoveredIds);

    dbDebug.log = false;

    return `${newIds.length} added, ${removedIds.length} removed, ${rediscoveredIds.length} rediscovered`;
  },
};
