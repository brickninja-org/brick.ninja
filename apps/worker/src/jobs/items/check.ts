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
    const res = await fetchApi('/api/v3.asmx/getSets?params={year:2020,extendedData:1,pageSize:10,pageNumber:1}', { apiKey: process.env.BRICKSET_API_KEY! });

    if (res.status === 'error') {
      return `Fetch error: ${res.message}`;
    }

    // const ids = res.sets.map((set) => set.setID);

    // get item ids from the DB
    const knownIds = await db.item.findMany({ select: { id: true }}).then((items) => items.map(({ id }) => id));

    // Build new ids
    // const newDbIds = ids.filter((id) => !knownIds.includes(id));
    const newIds = res.sets.filter((set) => !knownIds.includes(set.setID)).map((set) => set.number);

    await queuedJobsForIds('items.new', newIds, { batchSize: 50 });

    dbDebug.log = false;

    return `${newIds.length} added`;
  },
};
