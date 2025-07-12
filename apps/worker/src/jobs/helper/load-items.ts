// import data from '../../data/items.json';
import type { Item } from '@brickninjaapi/types/data/item';
import { groupLocalizedEntitiesById } from './group-by-id';
import { fetchApi } from './fetch-api';
import { SchemaVersion } from './schema';

// export type Item = typeof data.items[0];

export async function loadItems(ids: number[]) {
  const start = new Date();

  const [de, en, nl] = await Promise.all([
    fetchApi(`/v1/items?ids=${ids.join(',')}`, { language: 'de' }).then(normalizeItems),
    fetchApi(`/v1/items?ids=${ids.join(',')}`, { language: 'en' }).then(normalizeItems),
    fetchApi(`/v1/items?ids=${ids.join(',')}`, { language: 'es' }).then(normalizeItems),
    fetchApi(`/v1/items?ids=${ids.join(',')}`, { language: 'fr' }).then(normalizeItems),
    fetchApi(`/v1/items?ids=${ids.join(',')}`, { language: 'nl' }).then(normalizeItems),

    // data.items.filter((item) => ids.includes(item.id)).map(normalizeItem),
    // data.items.filter((item) => ids.includes(item.id)).map(normalizeItem),
    /*
    fetchApi(`/api/v3.asmx/getSets?params={query:'${ids.join(',')}',extendedData:1}`, { apiKey: process.env.BRICKSET_API_KEY! }).then((res) => {
      if (res.status === 'error' || !res.sets) {
        return [];
      }

      return normalizeItems(res.sets);
    }),
    */
  ]);

  console.log(`Fetched ${ids.length} items in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(de, en, es, fr, nl);
}

function normalizeItem(item: Item<SchemaVersion>): Item<SchemaVersion> {
  return item;
}

function normalizeItems(items: Item<SchemaVersion>[]) {
  return items.map(normalizeItem);
}
