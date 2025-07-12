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

    for (const [id, { de, en, es, fr, nl }] of items) {
      const revisions = await createRevisions({ de, en, es, fr, nl }, { buildId, type: 'Added', entity: 'Item', description: 'Added to API' });
      const data = await migrate({ de, en, es, fr, nl });

      const iconId = await createIcon(en.icon);

      await db.item.create({
        data: {
          id,
          name_de: de.name,
          name_en: en.name,
          name_es: es.name,
          name_fr: fr.name,
          name_nl: nl.name,
          iconId,

          ...data,

          currentId_de: revisions.de.id,
          currentId_en: revisions.en.id,
          currentId_es: revisions.es.id,
          currentId_fr: revisions.fr.id,
          currentId_nl: revisions.nl.id,
          history: { createMany: { data: [{ revisionId: revisions.de.id }, { revisionId: revisions.en.id }, { revisionId: revisions.es.id }, { revisionId: revisions.fr.id }, { revisionId: revisions.nl.id }] }},
        }
      });
    }

    return `Added ${items.size} items`;
  }
};
