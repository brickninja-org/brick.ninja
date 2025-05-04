import type { Job } from '../job';

import { db } from '../../db';
import { aggregateViews } from '../helper/aggregate-views';

export const ProductViews: Job = {
  run: () => {
    return aggregateViews('product', db.product.findMany, db.product.updateMany);
  },
};
