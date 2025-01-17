import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';

import Link from 'next/link';

import { cn } from '@brickninja-org/ui/lib';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/layout/HeroLayout';
import { FormatNumber } from '@/components/format/FormatNumber';

function getStatus() {
  const last30minutes = new Date();
  last30minutes.setMinutes(last30minutes.getMinutes() - 30);

  return Promise.all([
    db.job.count({ where: { state: 'Queued', scheduledAt: { lt: new Date() }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30minutes }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30minutes }, status: { notIn: [200, 206] }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30minutes }, responseTimeMs: { gt: 5000 }}}),
    db.$queryRaw<[{ size: string }]>`SELECT pg_size_pretty(pg_database_size(current_database())) as size;`,
  ]);
}

interface StatusRowProps {
  status: 'running' | 'success' | 'error';
  title: string;
  description: ReactNode;
  href: string;
}

const StatusRow: FC<StatusRowProps> = ({ status, title, description, href }) => {
  return (
    <Link href={href} className="group flex items-center py-3 px-4 border-t hover:bg-gray-100 hover:transition-colors first:border-none">
      <span className={cn(['inline-block w-2.5 h-2.5 mr-2 rounded-[5px]', status === 'running' ? 'bg-blue-600' : status === 'success' ? 'bg-green-600' : 'bg-red-600'])}/>
      <span className="group-hover:underline decoration-2">{title}</span>
      <span className="ml-auto">{description}</span>
    </Link>
  );
};

export default async function StatusPage() {
  const [queuedJobs, apiTotal, apiErrors, apiSlow, [dbTotal]] = await getStatus();

  const apiErrorsPercentage = apiErrors / apiTotal;
  const apiSlowPercentage = apiSlow / apiTotal;

  const apiErrorThreshold = 0.1;
  const apiSlowThreshold = 0.1;

  return (
    <HeroLayout color="green" hero={<Headline id="status">Status</Headline>}>
      <StatusRow title="Jobs" href="/status/jobs" description={`${queuedJobs} queued jobs`} status={queuedJobs > 25 ? 'running' : 'success'}/>
      <StatusRow title="API" href="/status/api" description={
        apiErrorsPercentage > apiErrorThreshold
          ? <><FormatNumber value={apiErrors}/> errors in the last 30 minutes</>
          : (apiSlowPercentage > apiSlowThreshold)
            ? <><FormatNumber value={apiSlow}/> slow requests in the last 30 minutes</>
            : <><FormatNumber value={apiTotal}/> requests in the last 30 minutes</>
      } status={apiErrorsPercentage > apiErrorThreshold ? 'error' : (apiSlowPercentage > apiErrorThreshold ? 'running' : 'success')}/>
      <StatusRow title="Database" href="/status/database" description={dbTotal.size} status="success"/>
    </HeroLayout>
  );
}

export const metadata: Metadata = {
  title: 'Status',
};
