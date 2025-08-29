import { Prisma } from '@brickninja-org/database';
import { db } from '../../db';
import { createIcon } from '../helper/create-icon';
import { getCurrentBuild } from '../helper/get-current-build';
import { loadItems } from '../helper/load-items';
import { Job } from '../job';
import { createMigrator } from './migration';
import { appendHistory } from '../helper/append-history';
import { createRevisionHash } from '../helper/revision';

export const ItemsRediscovered: Job = {
  run: async (rediscoveredIds: number[]) => {
    const build = await getCurrentBuild();
    const buildId = build.id;

    if (rediscoveredIds.length === 0) {
      return;
    }

    const items = await loadItems(rediscoveredIds);
    const migrate = await createMigrator();

    for (const [id, data] of items) {
      const item = await db.item.findUnique({ where: { id }});
      if (!item) {
        continue;
      }

      const iconId = await createIcon(data.en.icon);
      const migratedData = await migrate(data);

      const update: Prisma.ItemUpdateArgs['data'] = {
        removedFromApi: false,
        name_de: data.de.name,
        name_en: data.en.name,
        name_es: data.es.name,
        name_fr: data.fr.name,
        name_nl: data.nl.name,
        iconId,
        ...migratedData,
        lastCheckedAt: new Date(),
        history: { createMany: { data: [] }},
      };

      // create a new revision
      for (const language of ['de', 'en', 'es', 'fr', 'nl'] as const) {
        const serializedData = JSON.stringify(data[language]);
        const revision = await db.revision.create({
          data: {
            previousRevisionId: item[`currentId_${language}`],
            data: serializedData,
            hash: createRevisionHash(serializedData),
            description: 'Rediscovered in API',
            entity: 'Item',
            language,
            buildId,
          },
        });

        update[`currentId_${language}`] = revision.id;
        update.history = appendHistory(update, revision.id);
      }

      await db.item.update({ where: { id }, data: update });
    }

    return `Rediscovered ${rediscoveredIds.length} items`;
  },
};
