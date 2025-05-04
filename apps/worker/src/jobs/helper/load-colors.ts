import data from '../../data/colors.json';
import { groupLocalizedEntitiesById } from './group-by-id';

export type Color = typeof data.colors[0];

export async function loadColors(ids: number[]) {
  const start = new Date();

  // const colors = await fetchApi('/api/v3/lego/colors', { page_size: 500, page_num: 1 });
  const [en, nl] = await Promise.all([
    data.colors,
    data.colors,
  ]);

  console.log(`Fetched ${ids.length} colors in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupLocalizedEntitiesById(en, nl);
}
