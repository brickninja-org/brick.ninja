import type { Job } from '../job';
import type { ProcessEntitiesData } from '../helper/process-entities';

import { isEmptyObject } from '@brickninja-org/helper/is';

import { db } from '../../db';
import { fetchApi } from '../helper/fetch-api';
import { loadLocalizedEntities } from '../helper/load-entities';
import { createSubJobs, processLocalizedEntities } from '../helper/process-entities';

export const ColorsJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if (isEmptyObject(data)) {
      return createSubJobs(
        'colors',
        () => fetchApi('/v1/colors'),
        db.color.findMany,
        CURRENT_VERSION,
      );
    }

    return processLocalizedEntities(
      data,
      'Color',
      (ids) => loadLocalizedEntities('/v1/colors', ids),
      (id, revisionId) => ({ id_revisionId: { id, revisionId }}),
      (color) => {
        // if this is a new color lets check if there are items waiting for it
        
        return {
          name_en: color.en.name,
          name_nl: color.nl.name,

          plastic_code: rgbToHex(color.en.plastic.rgb as [number, number, number]),
          color_family: color.en.categories[0],
        };
      },
      db.color.findMany,
      (tx, data) => tx.color.create(data),
      (tx, data) => tx.color.update(data),
      CURRENT_VERSION,
    );
  },
};

function rgbToHex(rgb: [number, number, number]): string {
  return rgb.map((component) => component.toString(16).padStart(2, '0')).join('');
}
