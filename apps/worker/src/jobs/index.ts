import { BricklinkApiRequestsCleanup } from './bricklinkapi-requests/cleanup';
// import { ColorsJob } from './colors';
import { ItemsCheck } from './items/check';
import { ItemsNew } from './items/new';
import { Job } from './job';
import { JobsCleanup } from './jobs/cleanup';

const jobsInternal = {
  'test': { run: () => undefined } as Job,

  'items.check': ItemsCheck,
  // 'items.migrate': ItemsMigrate,
  'items.new': ItemsNew,

  // 'colors': ColorsJob,

  'bricklinkapi-requests.cleanup': BricklinkApiRequestsCleanup,

  'jobs.cleanup': JobsCleanup,
};

export const jobs = jobsInternal as Record<string, Job>;

export type JobName = keyof typeof jobsInternal;
