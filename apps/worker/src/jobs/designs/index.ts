import type { Job } from '../job';
import type { ProcessEntitiesData } from '../helper/process-entities';

import { isEmptyObject } from '@brickninja-org/helper/is';

import { db } from '../../db';
import { fetchApi } from '../helper/fetch-api';
import { loadEntities } from '../helper/load-entities';
import { createSubJobs, processEntities } from '../helper/process-entities';

export const DesignsJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if (isEmptyObject(data)) {
      return createSubJobs(
        'designs',
        () => fetchApi('/v1/elements/designs'),
        db.elementDesign.findMany,
        CURRENT_VERSION,
      );
    }

    return processEntities(
      data,
      'Design',
      (ids) => loadEntities('/v1/elements/designs', ids),
      (designId, revisionId) => ({ designId_revisionId: { revisionId, designId }}),
      (design) => {
        // if this is a new design lets check if there are items waiting for it

        return {
          name: design.name,

          type: design.type,
        };
      },
      db.elementDesign.findMany,
      (tx, data) => tx.elementDesign.create(data),
      (tx, data) => tx.elementDesign.update(data),
      CURRENT_VERSION,
    );
  },
};
