import type { Job } from '../job';

import { db } from '../../db';
import { aggregateViews } from '../helper/aggregate-views';

export const ItemsView: Job = {
  run: () => {
    return aggregateViews('item', db.item.findMany, db.item.updateMany);
  },
};
