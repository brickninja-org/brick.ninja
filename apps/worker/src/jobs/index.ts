import { BricklinkApiRequestsCleanup } from './bricklinkapi-requests/cleanup';
import { ColorsJob } from './colors';
import { IconColors } from './icons/colors';
import { ItemsCheck } from './items/check';
import { ItemContainerContent } from './items/container-content';
import { ItemsMigrate } from './items/migrate';
import { ItemsNew } from './items/new';
import { ItemsRediscovered } from './items/rediscovered';
import { ItemsRelevancy } from './items/relevancy';
import { ItemsRemoved } from './items/removed';
import { ItemsUpdate } from './items/update';
import { ItemsView } from './items/views';
import { Job } from './job';
import { JobsCleanup } from './jobs/cleanup';
import { ProductsJob } from './products';
import { ProductCategoriesJob } from './products/product-categories';
import { ProductViews } from './products/views';
import { RevisionsPrevious } from './revisions/previous';

const jobsInternal = {
  'test': { run: () => undefined } as Job,

  'items.check': ItemsCheck,
  'items.new': ItemsNew,
  'items.removed': ItemsRemoved,
  'items.rediscovered': ItemsRediscovered,
  'items.update': ItemsUpdate,
  'items.migrate': ItemsMigrate,
  'items.container-content': ItemContainerContent,
  'items.relevancy': ItemsRelevancy,
  'items.views': ItemsView,

  'products': ProductsJob,
  'product.categories': ProductCategoriesJob,
  'product.views': ProductViews,

  'colors': ColorsJob,

  'revisions.previous': RevisionsPrevious,

  'bricklinkapi-requests.cleanup': BricklinkApiRequestsCleanup,

  'icon.colors': IconColors,

  'jobs.cleanup': JobsCleanup,
};

export const jobs = jobsInternal as Record<string, Job>;

export type JobName = keyof typeof jobsInternal;
