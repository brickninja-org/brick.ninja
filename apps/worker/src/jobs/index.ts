import { Job } from './job';
import { JobsCleanup } from './jobs/cleanup';

const jobsInternal = {
  'test': { run: () => undefined } as Job,

  'jobs.cleanup': JobsCleanup,
};

export const jobs = jobsInternal as Record<string, Job>;

export type JobName = keyof typeof jobsInternal;
