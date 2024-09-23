import { console } from 'inspector';
import { fetchApi } from './fetch-api';
import { groupLocalizedEntitiesById } from './group-by-id';
import { GetSets } from '@brickset-api/types/data/get-sets';

export async function loadItems(ids: number[]) {
  const start = new Date();

  const [en] = await Promise.all([
    fetchApi(`/api/v3.asmx/getSets?params={query:'${ids.join(',')}',extendedData:1}`, { apiKey: process.env.BRICKSET_API_KEY! }).then((res) => {
      console.log(res);
      if (res.status === 'error' || !res.sets) {
        return [];
      }

      return normalizeItems(res.sets);
    }),
  ]);

  const nl = en;

  const missedIds = ids.filter((id) => !en.find((item) => item.setID === id));

  console.log(`Fetched ${ids.length} items in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);
  console.log(`Missed ${missedIds.length} items: ${missedIds.join(', ')}`);

  return groupLocalizedEntitiesById(en, nl);
}

function normalizeItem(item: GetSets) {
  return item;
}

function normalizeItems(items: GetSets[]) {
  return items.map(normalizeItem);
}
