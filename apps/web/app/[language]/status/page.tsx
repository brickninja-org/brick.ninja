import Link from 'next/link';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { FormatNumber } from '@/components/format/FormatNumber';
import { Iconify } from '@/components/iconify';
import { HeroLayout } from '@/components/layout/HeroLayout';

// ----------------------------
// Types & thresholds
// ----------------------------
type DatabaseSize = { size: string };
type StatusRowData = { statusColor: string, description: React.ReactNode };

const JOB_QUEUE_WARNING_THRESHOLD = 25;

// ----------------------------
// Helpers
// ----------------------------
function percentage(part: number, total: number): number {
  return total > 0 ? part / total : 0;
}

function getApiStatusColor(errorsPct: number, slowPct: number): string {
  if (errorsPct > 0.2 || slowPct > 0.2) return 'text-danger';
  if (errorsPct > 0.1 || slowPct > 0.1) return 'text-warning';
  if (errorsPct > 0.05 || slowPct > 0.05) return 'text-warning';
  return 'text-success';
}

function getApiDescription(errors: number, slow: number, total: number): React.ReactNode {
  const errorsPct = percentage(errors, total);
  const slowPct = percentage(slow, total);

  if (errorsPct > 0.05 || slowPct > 0.05) {
    return <><FormatNumber value={errors}/> errors, <FormatNumber value={slow}/> slow requests</>;
  }
  return <><FormatNumber value={total}/> requests in the last 30 minutes</>;
}

// ----------------------------
// Fetch metrics
// ----------------------------
function fetchStatusMetrics(): Promise<readonly [
  number,
  number,
  number,
  number,
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
  ]).then(([queuedJobs, apiTotal, apiErrors, apiSlow, dbSizeRaw]) => {
    return [queuedJobs, apiTotal, apiErrors, apiSlow, dbSizeRaw] as const;
  });
}

// ----------------------------
// Tuple types for status values
// ----------------------------
type StatusRowValuesMap = {
  jobs: [number],
  api: [number, number, number],
  database: [string],
};

// ----------------------------
// Status handlers
// ----------------------------
const statusHandlers = {
  jobs: (queuedJobs: number): StatusRowData => ({
    statusColor: queuedJobs > JOB_QUEUE_WARNING_THRESHOLD ? 'text-warning' : 'text-success',
    description: `${queuedJobs} queued jobs`,
  }),

  api: (total: number, errors: number, slow: number): StatusRowData => ({
    statusColor: getApiStatusColor(percentage(errors, total), percentage(slow, total)),
    description: getApiDescription(errors, slow, total),
  }),

  database: (size: string): StatusRowData => ({
    statusColor: 'text-success',
    description: size,
  }),
};

// ----------------------------
// StatusRow component
interface StatusRowProps<T extends keyof StatusRowValuesMap> {
  type: T,
  values: StatusRowValuesMap[T],
  title: string,
  href: string,
}

function StatusRow<T extends keyof StatusRowValuesMap>({ type, values, title, href }: StatusRowProps<T>) {
  const handler = statusHandlers[type] as (...args: StatusRowValuesMap[T]) => StatusRowData;
  const { statusColor, description } = handler(...values);

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
}

// ----------------------------
// Page component
export default async function StatusPage() {
  const statusMetrics: readonly [number, number, number, number, readonly DatabaseSize[]] = await fetchStatusMetrics();
  const [queuedJobs, apiTotal, apiErrors, apiSlow, dbSize] = statusMetrics;

  return (
    <HeroLayout color="green" hero={<Headline id="status">Status</Headline>}>
      <StatusRow type="jobs" values={[queuedJobs]} title="Jobs" href="/status/jobs"/>
      <StatusRow type="api" values={[apiTotal, apiErrors, apiSlow]} title="API" href="/status/api"/>
      <StatusRow type="database" values={[dbSize[0].size]} title="Database" href="/status/database"/>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Status',
});
