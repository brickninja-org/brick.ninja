import { db } from '../../db';
import { fetchApi } from '../helper/fetch-api';
import { Job } from '../job';

export const CategoriesCheck: Job = {
  run: async () => {
    // skip if any follow up jobs are still queued
    const queuedJobs = await db.job.count({ where: { type: { in: ['categories.new'] }, state: { in: ['Queued', 'Running'] }}});

    if (queuedJobs > 0) {
      return 'Waiting for pending follow up jobs';
    }

    // get category ids from the API
    const res = await fetchApi('/api/v3.asmx/getThemes', { apiKey: process.env.BRICKSET_API_KEY! });
    
    if (res.status === 'error') {
      return res.message;
    }

    console.log(res.themes);
  },
};
