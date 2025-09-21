import type { FC, ReactNode } from 'react';

import Link from 'next/link';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/layout/HeroLayout';
import { Iconify } from '@/components/iconify';
import { getStatusRow } from './status.helper';

// Prisma return types
type JobCount = Awaited<ReturnType<typeof db.job.count>>;
type ApiRequestCount = Awaited<ReturnType<typeof db.apiRequest.count>>;
type DbSize = { size: string };

function getStatus(): Promise<
  readonly [JobCount, ApiRequestCount, ApiRequestCount, ApiRequestCount, readonly DbSize[]],
> {
  const last30minutes = new Date();
  last30minutes.setMinutes(last30minutes.getMinutes() - 30);

  const results = await Promise.all([
    db.job.count({ where: { state: 'Queued', scheduledAt: { lt: new Date() }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30minutes }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30minutes }, status: { notIn: [200, 206] }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30minutes }, responseTimeMs: { gt: 5000 }}}),
    db.$queryRaw<[{ size: string }]>`SELECT pg_size_pretty(pg_database_size(current_database())) as size;`,
  ]);

  return results as const;
}

interface StatusRowProps {
  title: string,
  description: ReactNode,
  href: string,
  statusColor: string,
}

const StatusRow: FC<StatusRowProps> = ({ title, description, href, statusColor }) => {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 py-3 px-4 border-t hover:bg-accent-soft hover:transition-colors first:border-none"
    >
      <Iconify className={statusColor} icon="circle-fill" width={12}/>
      <span className="group-hover:underline decoration-2">{title}</span>
      <span className="ml-auto">{description}</span>
    </Link>
  );
};

export default async function StatusPage() {
  const [queuedJobs, apiTotal, apiErrors, apiSlow, dbSize] = await getStatus();

  return (
    <HeroLayout color="green" hero={<Headline id="status">Status</Headline>}>
      <StatusRow title="Jobs" href="/status/jobs" {...getStatusRow('jobs', queuedJobs)}/>
      <StatusRow title="API" href="/status/api" {...getStatusRow('api', apiTotal, apiErrors, apiSlow)}/>
      <StatusRow title="Database" href="/status/database" {...getStatusRow('database', dbSize[0].size)}/>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Status',
});
