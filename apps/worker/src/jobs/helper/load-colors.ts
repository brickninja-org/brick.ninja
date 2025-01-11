import { groupById } from '@brickninja-org/helper/group-by';
import { fetchApi } from './fetch-rebrickable-api';

export async function loadColors() {
  const start = new Date();

  const colors = await fetchApi('/api/v3/lego/colors', { page_size: 500, page_num: 1 });

  console.log(`Fetched ${colors.count} colors in ${(new Date().valueOf() - start.valueOf()) / 1000}s`);

  return groupById(colors.results);
}
