import { isEmptyObject } from '@brickninja-org/helper/is';

import { db } from '../../db';
import { fetchApi } from '../helper/fetch-api';
import { Job } from '../job';
import { createSubJobs, processEntities, type ProcessEntitiesData } from '../helper/process-entities';
import { loadColors } from '../helper/load-colors';

export const ColorsJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if (isEmptyObject(data)) {
      return createSubJobs(
        'colors',
        () => fetchApi('/api/store/v1/colors'),
        db.color.findMany,
        CURRENT_VERSION,
      );
    }

    return processEntities(
      data,
      'Color',
      (colorId, revisionId) => ({ colorId_revisionId: { revisionId, colorId }}),
      async (colors, version, changes) => {
        // if this is a new color lets check if there are items waiting for it

        return {
          id: colors.color_id,
          name_en: colors.color_name,

          code: colors.code,
          type: colors.type,
        };
      },
      db.color.findMany,
      loadColors,
      (tx, data) => tx.color.create(data),
      (tx, data) => tx.color.update(data),
      CURRENT_VERSION,
    );
  }
};
