import { db, dbDebug } from '../../db';
import { fetchApi } from '../helper/fetch-api';
import { queuedJobsForIds } from '../helper/queued-job-for-ids';
import { Job } from '../job';

export const ItemsCheck: Job = {
  run: async () => {
    dbDebug.log = true;

    // skip if any follow up jobs are still queued
    const queuedJobs = await db.job.count({ where: { type: { in: ['items.new'] }, state: { in: ['Queued', 'Running'] }}});

    if (queuedJobs > 0) {
      return 'Waiting for pending follow up jobs';
    }

    // get item ids from the API
    // params=%7B"year"%3A2024%2C"pageSize"%3A5%7D
    const res = await fetchApi(`/api/v3.asmx/getSets?params=${JSON.stringify({ year: 2004, pageSize: 5 })}` as '/getSets', { apiKey: process.env.BRICKSET_API_KEY! });

    if (res.status === 'error' || !res.sets) {
      return;
    }

    const ids = res.sets.map((set) => set.setID);

    // get item ids from the DB
    const knownIds = await db.item.findMany({ select: { id: true }}).then((items) => items.map(({ id }) => id));

    // Build new ids
    const newIds = ids.filter((id) => !knownIds.includes(id));

    await queuedJobsForIds('items.new', newIds);

    dbDebug.log = false;

    return `${newIds.length} added`;
  },
};
