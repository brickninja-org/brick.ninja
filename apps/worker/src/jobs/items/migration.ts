import { Prisma } from '@brickninja-org/database';
// import { db } from '../../db';
import { LocalizedObject } from '../helper/types';
import { Item } from '../helper/load-items';
import { db } from '../../db';
import { toId } from '../helper/to-id';
import { isDefined } from '@brickninja-org/helper/is';

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

  productIds?: number[];
  products?: Prisma.ProductCreateNestedManyWithoutItemsInput;
}

export async function createMigrator() {
  const knownProductIds = (await db.product.findMany({ select: { id: true }})).map(toId);
  // const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(({ id }) => id);

  // eslint-disable-next-line require-await
  return async function migrate({ en }: LocalizedObject<Item>, currentVersion = -1) {
    const update: MigratedItem = {
      version: CURRENT_VERSION,
    };

    // populate common fields
    if (currentVersion <= 0) {
      update.type = en.type;
      update.subtype = en.details?.type;
    }

    // version 1: add products
    if (currentVersion < 1) {
      const products = [en.default_product, ...(en.details?.products ?? [])].filter(isDefined).map(Number);

      update.productIds = products;
      update.products = { connect: products.filter((id) => knownProductIds.includes(id)).map((id) => ({ id })) };
    }

    /*
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
    */

    return update satisfies Prisma.ItemUpdateInput;
  };
}
