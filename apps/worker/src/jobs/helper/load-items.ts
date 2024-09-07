import { console } from "inspector";
import { fetchApi } from "./fetch-api";
import { groupLocalizedEntitiesById } from "./group-by-id";
import { Item } from "@brickset-api/types/data/get-sets";

export async function loadItems(ids: number[]) {
  const start = new Date();

  const [en] = await Promise.all([
    fetchApi(`/v3.asmx/getSets`, { apiKey: process.env.BRICKSET_API_KEY! }).then((res) => {
      if (res.status === 'error' || !res.sets) {
        return [];
      }

      return normalizeItems(res.sets);
    }),
  ]);

  const nl = en;

  console.log(`Fetched ${ids.length} items in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(en, nl);
}

function normalizeItem(item: Item) {
  return item;
}

function normalizeItems(items: Item[]) {
  return items.map(normalizeItem)
}
