import type { FC } from 'react';
import type { Metadata } from 'next';

import Link from 'next/link';

import { Headline } from '@brickninja-org/ui/components/headline';

import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/layout/hero-layout';

function getStatus() {
  const last30minutes = new Date();
  last30minutes.setMinutes(last30minutes.getMinutes() - 30);

  return Promise.all([
    db.job.count({ where: { state: 'Queued', scheduledAt: { lt: new Date() }}}),
    db.$queryRaw<[{ size: string }]>`SELECT pg_size_pretty(pg_database_size(current_database())) as size;`,
  ]);
}

interface StatusRowProps {
  title: string;
  description: string;
  href: string;
}

const StatusRow: FC<StatusRowProps> = ({ title, description, href }) => {
  return (
    <Link href={href} className="group flex items-center py-3 px-4 border-t hover:bg-gray-100 hover:transition-colors first:border-none">
      <span className="group-hover:underline decoration-2">{title}</span>
      <span className="ml-auto">{description}</span>
    </Link>
  );
};

export default async function StatusPage() {
  const [queuedJobs, [dbTotal]] = await getStatus();

  return (
    <HeroLayout color="green" hero={<Headline id="status">Status</Headline>}>
      <StatusRow title="Jobs" href="/status/jobs" description={`${queuedJobs} queued jobs`}/>
      <StatusRow title="Database" href="/status/database" description={dbTotal.size}/>
    </HeroLayout>
  );
}

export const metadata: Metadata = {
  title: 'Status',
};
