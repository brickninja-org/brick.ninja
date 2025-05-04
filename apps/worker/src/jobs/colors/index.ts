import type { Job } from '../job';
import type { ProcessEntitiesData } from '../helper/process-entities';

import { createSubJobs, processLocalizedEntities } from '../helper/process-entities';
import { isEmptyObject } from '@brickninja-org/helper/is';
import { db } from '../../db';

import rawData from '../../data/colors.json';
import { loadColors } from '../helper/load-colors';
import { toId } from '../helper/to-id';

export const ColorsJob: Job = {
  run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if (isEmptyObject(data)) {
      return createSubJobs(
        'colors',
        () => new Promise((resolve) => resolve(rawData.colors.map(toId))) as unknown as Promise<number[]>,
        db.color.findMany,
        CURRENT_VERSION,
      );
    }

    return processLocalizedEntities(
      data,
      'Color',
      (colorId, revisionId) => ({ colorId_revisionId: { revisionId, colorId }}),
      (color) => {
        // if this is a new color lets check if there are items waiting for it
        
        return {
          name_en: color.en.name,
          name_nl: color.nl.name,

          type: color.en.type,

          plastic_code: rgbToHex(color.en.plastic.rgb as [number, number, number]),
          color_family: color.en.family,
        };
      },
      db.color.findMany,
      loadColors,
      (tx, data) => tx.color.create(data),
      (tx, data) => tx.color.update(data),
      CURRENT_VERSION,
    );
  },
};

function rgbToHex(rgb: [number, number, number]): string {
  return rgb.map((component) => component.toString(16).padStart(2, '0')).join('');
}
