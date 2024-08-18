import { fetchApi } from './fetch-api';
import { groupEntitiesById } from './group-by-id';

export async function loadColors(ids: number[]) {
  const start = new Date();

  const res = await fetchApi('/api/store/v1/colors');

  console.log(`Fetched ${ids.length} colors in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupEntitiesById(res);
}
