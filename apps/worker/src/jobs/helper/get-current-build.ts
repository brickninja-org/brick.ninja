import { Build } from '@brickninja-org/database';
import { db } from '../../db';

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

// eslint-disable-next-line require-await
async function getBuildFromApi() {
  const content = '115790 0505 2025 1240 0064'; // Simulated API response

  if (!content.match(/^\d+ \d+ \d+ \d+ \d+$/)) {
    throw new Error('Got invalid build id response from API.');
  }

  return Number(content.split(' ')[0]);
}
