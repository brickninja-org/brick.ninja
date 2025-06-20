import { db, dbDebug } from '../../db';
import { fetchApi } from '../helper/fetch-api';
import { queuedJobsForIds } from '../helper/queued-job-for-ids';
import { toId } from '../helper/to-id';
import { Job } from '../job';
// import data from '../../data/items.json';

export const ItemsCheck: Job = {
  run: async () => {
    dbDebug.log = true;

    // skip if any follow up jobs are still queued
    const queuedJobs = await db.job.count({ where: { type: { in: ['items.new', 'items.removed', 'items.rediscovered'] }, state: { in: ['Queued', 'Running'] }}});

    if (queuedJobs > 0) {
      return 'Waiting for pending follow up jobs';
    }

    // skip if we reached the limit of 100 API calls today
    /*
    const apiCount = await db.apiRequest.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }}});
    if (apiCount >= 100) {
      return `Reached API limit of ${apiCount} calls today`;
    }
    */

    // get item ids from the API
    const ids = await fetchApi('/v1/items');
    /*
    const res = await fetchApi('/api/v3.asmx/getSets?params={year:2025,extendedData:1,pageSize:500,pageNumber:1}', { apiKey: process.env.BRICKSET_API_KEY! });

    if (res.status === 'error') {
      return res.message;
    }
    */

    //const ids = data.items.map(toId);

    // get item ids from the DB
    const knownIds = await db.item.findMany({ select: { id: true }}).then((items) => items.map(toId));
    const knownRemovedIds = await db.item.findMany({ select: { id: true }, where: { removedFromApi: true }}).then((items) => items.map(toId));

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
