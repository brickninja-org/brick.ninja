import type { Item } from '@brickninjaapi/types/data/item';

import { Prisma } from '@brickninja-org/database';
// import { db } from '../../db';
import { LocalizedObject } from '../helper/types';
import { db } from '../../db';
import { toId } from '../helper/to-id';
import { isDefined, isTruthy } from '@brickninja-org/helper/is';

export const CURRENT_VERSION = 2;

/** @see Prisma.ItemUpdateInput */
interface MigratedItem {
  version: number;

  name_de?: string;
  name_en?: string;
  name_es?: string;
  name_fr?: string;
  name_nl?: string;
  type?: string;
  subtype?: string;

  removedFromApi?: boolean;
  lastCheckedAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  instructionItemIds?: number[];
  instructionItems?: Prisma.ItemUpdateManyWithoutInstructionInNestedInput;

  productIds?: number[];
  products?: Prisma.ProductCreateNestedManyWithoutItemsInput;
}

export async function createMigrator() {
  const knownItemIds = (await db.item.findMany({ select: { id: true }})).map(toId);
  const knownProductIds = (await db.product.findMany({ select: { id: true }})).map(toId);

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
      const products = [en.default_product /*, ...(en.details?.products ?? []) */].filter(isDefined).map(Number);

      update.productIds = products;
      update.products = { connect: products.filter((id) => knownProductIds.includes(id)).map((id) => ({ id })) };
    }

    // version 2: add instruction items
    if (currentVersion < 2) {
      const instructionItemIds = [...(en.details?.instruction_item_ids || [])].map(Number).filter(isTruthy);

      update.instructionItemIds = instructionItemIds;
      update.instructionItems = { connect: instructionItemIds.filter((id) => knownItemIds.includes(id)).map((id) => ({ id })) };
    }

    /*
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
