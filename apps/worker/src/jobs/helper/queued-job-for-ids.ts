import type { JobName } from '..';

import { db } from '../../db';

export async function queuedJobsForIds(name: JobName, ids: number[] | string [], { priority = 2, batchSize = 200 } = {}) {
  if (ids.length === 0) {
    return;
  }

  for (let start = 0; start < ids.length; start += batchSize) {
    await db.job.createMany({ data: { type: name, data: ids.slice(start, start + batchSize), priority }});
  }
}
