import { db } from '../../db';
import { createIcon } from '../helper/create-icon';
import { getCurrentBuild } from '../helper/get-current-build';
import { loadItems } from '../helper/load-items';
import { createRevisions } from '../helper/revision';
import { Job } from '../job';
import { createMigrator } from './migration';

export const ItemsNew: Job = {
  run: async (newIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    // load items
    const items = await loadItems(newIds);

    const migrate = await createMigrator();

    for (const [id, { en, nl }] of items) {
      const revisions = await createRevisions({ en, nl }, { buildId, type: 'Added', entity: 'Item', description: 'Added to API' });
      const data = await migrate({ en, nl });

      const iconId = await createIcon(en.icon);

      await db.item.create({
        data: {
          id,
          name_en: en.name,
          name_nl: nl.name,
          iconId,

          ...data,

          currentId_en: revisions.en.id,
          currentId_nl: revisions.nl.id,
          history: { createMany: { data: [{ revisionId: revisions.en.id }, { revisionId: revisions.nl.id }] }},
        }
      });
    }

    return `Added ${items.size} items`;
  }
};
