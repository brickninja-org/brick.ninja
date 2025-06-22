import { Build } from '@brickninja-org/database';
import { db } from '../../db';
import { fetchApi } from './fetch-api';

export async function getCurrentBuild(): Promise<Build> {
  const apiBuild = await getBuildFromApi();

  // check if build is known
  const build = await db.build.findUnique({ where: { id: apiBuild }});

  if (build) {
    return build;
  }

  console.log(`Creating new build ${apiBuild}`);
  return await db.build.create({ data: { id: apiBuild }});
}

async function getBuildFromApi() {
  // const content = '115812 1806 2025 2218 0072'; // Simulated API response
  const { id } = await fetchApi('/v1/build') as { id: string };

  return Number(id);

  /*
  if (!content.match(/^\d+ \d+ \d+ \d+ \d+$/)) {
    throw new Error('Got invalid build id response from API.');
  }

  return Number(content.split(' ')[0]);
  */
}
