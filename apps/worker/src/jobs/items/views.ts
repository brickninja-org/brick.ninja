// import { db } from '../../db';
// import { aggregateViews } from '../helper/aggregate-views';
import { Job } from '../job';

export const ItemsView: Job = {
  run: () => {
    // return aggregateViews('item', db.item.findMany, db.item.updateMany);
  },
};
