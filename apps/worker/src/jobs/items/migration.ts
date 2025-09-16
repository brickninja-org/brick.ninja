import type { Item } from '@brickninjaapi/types/data/item';

import { Prisma } from '@brickninja-org/database';
// import { db } from '../../db';
import { LocalizedObject } from '../helper/types';
import { db } from '../../db';
import { toId } from '../helper/to-id';
import { isDefined } from '@brickninja-org/helper/is';

export const CURRENT_VERSION = 4;

/** @see Prisma.ItemUpdateInput */
interface MigratedItem {
  version: number,

  name_de?: string,
  name_en?: string,
  name_es?: string,
  name_fr?: string,
  name_nl?: string,
  type?: string,
  subtype?: string,
  barcode?: string,

  removedFromApi?: boolean,
  lastCheckedAt?: Date | string,
  createdAt?: Date | string,
  updatedAt?: Date | string,

  designIds?: number[],
  designs?: Prisma.ElementDesignCreateNestedManyWithoutItemsInput,

  productIds?: number[],
  products?: Prisma.ProductCreateNestedManyWithoutItemsInput,
}

export async function createMigrator() {
  const knownDesignIds = (await db.elementDesign.findMany({ select: { id: true }})).map(toId);
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

    // version 3: add item barcodes
    if (currentVersion < 3) {
      update.barcode = en.barcode;
    }

    // version 4: add design ids
    if (currentVersion < 4) {
      const designIds = en.details?.design_id ? [en.details.design_id] : undefined;

      update.designIds = designIds;
      update.designs = { connect: designIds?.filter((id) => knownDesignIds.includes(id)).map((id) => ({ id })) ?? [] };
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
