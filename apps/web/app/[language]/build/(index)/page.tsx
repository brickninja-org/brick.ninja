import type { Language } from '@brickninja-org/database';

import { cache } from '@/lib/cache';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { getLanguage } from '@/lib/translate';
import { BuildTable } from './BuildTable';

const getBuilds = cache(async (language: Language) => {
  const builds = await db.build.findMany({
    where: { id: { not: 0 }},
    orderBy: { id: 'desc' },
  });

  const updates = await db.revision.groupBy({
    by: ['buildId', 'entity'],
    where: { type: 'Updated', entity: { in: ['Item', 'Product', 'Design', 'Color'] }, language, buildId: { in: builds.map((build) => build.id) }},
    _count: { _all: true },
  });

  return { builds, updates };
}, ['builds'], { revalidate: 600 });

export default async function BuildPage() {
  const language = await getLanguage();
  const { builds, updates } = await getBuilds(language);

  const buildsWithUpdates = builds.map((build) => ({
    build,
    updates: updates.filter(({ buildId }) => buildId === build.id),
  }));

  return (
    <BuildTable rows={buildsWithUpdates}/>
  );
}

export const generateMetadata = createMetadata({
  title: 'Builds',
});
