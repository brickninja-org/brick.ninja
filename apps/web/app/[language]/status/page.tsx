import type { FC, ReactNode } from 'react';

import Link from 'next/link';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { FormatNumber } from '@/components/format/FormatNumber';
import { HeroLayout } from '@/components/layout/HeroLayout';
import { Iconify } from '@/components/iconify';

type DatabaseSize = { size: string };

// Thresholds
const JOB_QUEUE_WARNING_THRESHOLD = 25;
const API_ERROR_THRESHOLD = 0.1;
const API_SLOW_THRESHOLD = 0.1;

// fetchStatusMetrics returns all status metrics in parallel
function fetchStatusMetrics(): Promise<readonly [
  number, // queuedJobs
  number, // apiTotalRequests
  number, // apiErrorCount
  number, // apiSlowCount
  readonly DatabaseSize[]
]> {
  const last30minutes = new Date();
  last30minutes.setMinutes(last30minutes.getMinutes() - 30);

  return Promise.all([
    db.job.count({ where: { state: 'Queued', scheduledAt: { lt: new Date() }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30minutes }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30minutes }, status: { notIn: [200, 206] }}}),
    db.apiRequest.count({ where: { createdAt: { gt: last30minutes }, responseTimeMs: { gt: 5000 }}}),
    db.$queryRaw<DatabaseSize[]>`SELECT pg_size_pretty(pg_database_size(current_database())) as size;`,
  ]).then(([queuedJobs, apiTotalRequests, apiErrorCount, apiSlowCount, dbSizeRaw]) => {
    const dbSize: readonly DatabaseSize[] = dbSizeRaw;
    return [queuedJobs, apiTotalRequests, apiErrorCount, apiSlowCount, dbSize] as const;
  });
}

// ----------------------------
// Type-safe object mapping
// ----------------------------
type StatusRowData = { statusColor: string, description: ReactNode };

type StatusHandlerMap = {
  jobs: (queuedJobs: number) => StatusRowData,
  api: (total: number, errors: number, slow: number) => StatusRowData,
  database: (size: string) => StatusRowData,
};

const statusHandlers: StatusHandlerMap = {
  jobs: (queuedJobs) => ({
    statusColor: queuedJobs > JOB_QUEUE_WARNING_THRESHOLD ? 'text-warning' : 'text-success',
    description: `${queuedJobs} queued jobs`,
  }),

  api: (total, errors, slow) => {
    const errorsPct = total > 0 ? errors / total : 0;
    const slowPct = total > 0 ? slow / total : 0;

    if (errorsPct > API_ERROR_THRESHOLD) {
      return { statusColor: 'text-danger', description: <><FormatNumber value={errors}/> errors in the last 30 minutes</> };
    }
    if (slowPct > API_SLOW_THRESHOLD) {
      return { statusColor: 'text-warning', description: <><FormatNumber value={slow}/> slow requests in the last 30 minutes</> };
    }
    return { statusColor: 'text-success', description: <><FormatNumber value={total}/> requests in the last 30 minutes</> };
  },

  database: (size) => ({
    statusColor: 'text-success',
    description: size,
  }),
};

// ----------------------------
// Type-safe generic helper
// ----------------------------
function getStatusRowData(type: 'jobs', queuedJobs: number): StatusRowData;
function getStatusRowData(type: 'api', total: number, errors: number, slow: number): StatusRowData;
function getStatusRowData(type: 'database', size: string): StatusRowData;

function getStatusRowData(
  type: keyof StatusHandlerMap,
  a: number | string,
  b?: number,
  c?: number
): StatusRowData {
  switch (type) {
    case 'jobs':
      return statusHandlers.jobs(a as number);
    case 'api':
      return statusHandlers.api(a as number, b as number, c as number);
    case 'database':
      return statusHandlers.database(a as string);
    default:
      throw new Error(`Unknown status type: ${type}`);
  }
}

interface StatusRowProps {
  title: string,
  href: string,
  statusColor: string,
  description: React.ReactNode,
}

const StatusRow: FC<StatusRowProps> = ({ title, description, href, statusColor }) => (
  <Link
    href={href}
    className="group flex items-center gap-2 py-3 px-4 border-t hover:bg-accent-soft hover:transition-colors first:border-none"
  >
    <Iconify className={statusColor} icon="circle-fill" width={12}/>
    <span className="group-hover:underline decoration-2">{title}</span>
    <span className="ml-auto">{description}</span>
  </Link>
);

export default async function StatusPage() {
  const [queuedJobs, apiTotal, apiErrors, apiSlow, dbSize]: [number, number, number, number, readonly DatabaseSize[]] = await fetchStatusMetrics();

  return (
    <HeroLayout color="green" hero={<Headline id="status">Status</Headline>}>
      <StatusRow title="Jobs" href="/status/jobs" {...getStatusRowData('jobs', queuedJobs)}/>
      <StatusRow title="API" href="/status/api" {...getStatusRowData('api', apiTotal, apiErrors, apiSlow)}/>
      <StatusRow title="Database" href="/status/database" {...getStatusRowData('database', dbSize[0].size)}/>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Status',
});
