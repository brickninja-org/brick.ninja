import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { cache } from '@/lib/cache';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { PageLayout } from '@/components/layout/PageLayout';
import { ensureUserIsAdmin } from '../admin';
import { QueueJobForm } from './QueueJobForm';

const getJobsTypes = cache(async () => {
  const jobs = await db.job.findMany({ select: { type: true }, distinct: ['type'], orderBy: { type: 'asc' }});
  return jobs.map((j) => ({ key: j.type, label: j.type }));
}, ['get-job-types'], { revalidate: 60 });

export default async function AdminQueueJobPage() {
  await ensureUserIsAdmin();

  const jobs = await getJobsTypes();

  return (
    <PageLayout>
      <Headline id="apps">Queue Job</Headline>
      <QueueJobForm jobs={jobs}/>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Jobs',
});
