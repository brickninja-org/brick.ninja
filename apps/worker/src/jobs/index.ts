import { BricklinkApiRequestsCleanup } from './bricklinkapi-requests/cleanup';
import { CategoriesCheck } from './categories/check';
// import { ColorsJob } from './colors';
import { ItemsCheck } from './items/check';
import { ItemsMigrate } from './items/migrate';
import { ItemsNew } from './items/new';
import { ItemsUpdate } from './items/update';
import { ItemsView } from './items/views';
import { Job } from './job';
import { JobsCleanup } from './jobs/cleanup';
import { RevisionsPrevious } from './revisions/previous';

const jobsInternal = {
  'test': { run: () => undefined } as Job,

  'items.check': ItemsCheck,
  'items.migrate': ItemsMigrate,
  'items.new': ItemsNew,
  'items.update': ItemsUpdate,
  'items.views': ItemsView,

  'categories.check': CategoriesCheck,

  // 'colors': ColorsJob,

  'revisions.previous': RevisionsPrevious,

  'bricklinkapi-requests.cleanup': BricklinkApiRequestsCleanup,

  'jobs.cleanup': JobsCleanup,
};

export const jobs = jobsInternal as Record<string, Job>;

export type JobName = keyof typeof jobsInternal;
