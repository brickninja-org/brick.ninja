import { Prisma } from '@brickninja-org/database';
// import { db } from '../../db';
import { LocalizedObject } from '../helper/types';
import { GetSets } from '@brickset-api/types/data/get-sets';

export const CURRENT_VERSION = 1;

/** @see Prisma.ItemUpdateInput */
interface MigratedItem {
  version: number;

  name_en?: string;
  name_nl?: string;
  type?: string;
  subtype?: string;
  removedFromApi?: boolean;

  lastCheckedAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export async function createMigrator() {
  // const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(({ id }) => id);

  return async function migrate({ en }: LocalizedObject<GetSets>, currentVersion = -1) {
    console.log(en);

    const update: MigratedItem = {
      version: CURRENT_VERSION,
    };

    // populate common fields
    if (currentVersion <= 0) {
      update.type = 'Set';
      // update.subtype = en.subtheme;
    }

    return update satisfies Prisma.ItemUpdateInput;
  };
}
