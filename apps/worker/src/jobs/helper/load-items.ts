import data from '../../data/items.json';
import { groupLocalizedEntitiesById } from './group-by-id';

export type Item = typeof data.items[0];

export async function loadItems(ids: number[]) {
  const start = new Date();

  const [en, nl] = await Promise.all([
    data.items.filter((item) => ids.includes(item.id)).map(normalizeItem),
    data.items.filter((item) => ids.includes(item.id)).map(normalizeItem),
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

  return groupLocalizedEntitiesById(en, nl);
}

function normalizeItem(item: Item) {
  return item;
}

/*
function normalizeItems(items: Item[]) {
  return items.map(normalizeItem);
}
*/
