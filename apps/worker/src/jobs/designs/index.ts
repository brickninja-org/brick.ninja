import type { Job } from '../job';
import type { ProcessEntitiesData } from '../helper/process-entities';

import { isEmptyObject } from '@brickninja-org/helper/is';

import { db } from '../../db';
import { fetchApi } from '../helper/fetch-api';
import { loadEntities } from '../helper/load-entities';
import { Changes, createSubJobs, processEntities } from '../helper/process-entities';
import { toId } from '../helper/to-id';

export const DesignsJob: Job = {
  async run(data: ProcessEntitiesData<number> | Record<string, never>) {
    const CURRENT_VERSION = 1;

    if (isEmptyObject(data)) {
      return createSubJobs(
        'designs',
        () => fetchApi('/v1/elements/designs'),
        db.elementDesign.findMany,
        CURRENT_VERSION,
      );
    }

    const knownItemIds = (await db.item.findMany({ where: { type: 'Element' }, select: { id: true }})).map(toId);

    return processEntities(
      data,
      'Design',
      (ids) => loadEntities('/v1/elements/designs', ids),
      (designId, revisionId) => ({ designId_revisionId: { revisionId, designId }}),
      (design, version, changes) => {
        const connectOrSet = changes === Changes.New ? 'connect' : 'set';

        return {
          name: design.name,

          type: design.type,

          elementDesigns: { [connectOrSet]: design.element_items?.filter((id) => knownItemIds.includes(id)).map((id) => ({ id })) ?? [] },
        };
      },
      db.elementDesign.findMany,
      (tx, data) => tx.elementDesign.create(data),
      (tx, data) => tx.elementDesign.update(data),
      CURRENT_VERSION,
    );
  },
};
