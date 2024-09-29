import { Prisma } from '@brickninja-org/database';
// import { db } from '../../db';
import { LocalizedObject } from '../helper/types';
import { GetSets } from '@brickset-api/types/data/get-sets';

export const CURRENT_VERSION = 5;

/** @see Prisma.ItemUpdateInput */
interface MigratedItem {
  version: number;

  name_en?: string;
  name_nl?: string;
  type?: string;
  subtype?: string;
  productCode?: string;
  pieceCount?: number;
  minifigureCount?: number;
  year?: number;
  released?: boolean;
  minAge?: number;
  removedFromApi?: boolean;

  lastCheckedAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// eslint-disable-next-line require-await
export async function createMigrator() {
  // const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(({ id }) => id);

  // eslint-disable-next-line require-await
  return async function migrate({ en }: LocalizedObject<GetSets>, currentVersion = -1) {
    // console.log(en);

    const update: MigratedItem = {
      version: CURRENT_VERSION,
    };

    // populate common fields
    if (currentVersion <= 0) {
      update.type = 'Set';
      // update.subtype = en.subtheme;
    }

    if (currentVersion < 2) {
      update.productCode = en.number;
      update.pieceCount = en.pieces;
      update.minifigureCount = en.minifigs;
    }

    if (currentVersion < 4) {
      // Books / Magazines
      if (en.theme === 'Books') {
        update.type = 'Book';
        if (en.number.startsWith('BRICKJOURNAL') || en.number.startsWith('BLOCKS')) {
          update.subtype = 'Magazine';
        }
      } else if (en.theme === 'Gear') {
        update.type = 'Gear';
      }
    }

    if (currentVersion < 5) {
      update.year = en.year;
      update.released = en.released;
      update.minAge = en.ageRange?.min;
    }

    return update satisfies Prisma.ItemUpdateInput;
  };
}
