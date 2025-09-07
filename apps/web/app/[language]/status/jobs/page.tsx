import type { VariantProps } from '@heroui/react';

import { tv } from '@heroui/react';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { table, Table } from '@brickninja-org/ui/components/table/Table';

import { cache } from '@/lib/cache';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/format/FormatDate';
import { FormatNumber } from '@/components/format/FormatNumber';
import { PageLayout } from '@/components/layout/PageLayout';
import { ReloadCheckbox } from '@/components/reload/ReloadCheckbox';

const status = tv({
  base: 'mr-2 w-2.5 h-2.5 inline-block rounded-[5px]',
  variants: {
    color: {
      success: 'bg-green-600',
      running: 'bg-yellow-500',
      error: 'bg-red-500',
      scheduled: 'bg-blue-500/50',
      queued: 'bg-blue-500',
    },
  },
  defaultVariants: {
    color: 'queued',
  },
});

export type StatusVariants = VariantProps<typeof status>;

const getJobs = cache(async () => {
  const now = new Date();

  const [active, scheduled, finished] = await Promise.all([
    db.job.findMany({ where: { OR: [{ state: { in: ['Running', 'Queued'] }}, { cron: { not: '' }}], scheduledAt: { lte: now }}, orderBy: [{ priority: 'desc' }, { scheduledAt: 'asc' }] }),
    db.job.findMany({ where: { OR: [{ state: { in: ['Running', 'Queued'] }}, { cron: { not: '' }}], scheduledAt: { gt: now }}, orderBy: [{ scheduledAt: 'asc' }] }),
    db.job.findMany({ where: { state: { notIn: ['Running', 'Queued'] }}, orderBy: { finishedAt: 'desc' }, take: 100 }),
  ]);

  return { active, scheduled, finished, now };
}, ['jobs'], { revalidate: 1, tags: ['jobs'] });

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <>
      {minutes > 0 && <><FormatNumber value={minutes} unit="m"/></>}
      <FormatNumber value={seconds} unit="s"/>
    </>
  );
}

async function JobsPage() {
  const { active, scheduled, finished, now } = await getJobs();

  const { td, tr } = table();

  return (
    <PageLayout>
      <Headline id="jobs" actions={<ReloadCheckbox intervalMs={1000}/>}>
        Active Jobs ({active.length + scheduled.length })
      </Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small>Status</Table.HeaderCell>
            <Table.HeaderCell>Job</Table.HeaderCell>
            <Table.HeaderCell small align="end">Runtime</Table.HeaderCell>
            <Table.HeaderCell small align="end">Scheduled</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {[...active, ...scheduled].map((job) => (
            <tr key={job.id} className={tr()}>
              <td className={td()} style={{ whiteSpace: 'nowrap' }}><span className={status({ color: job.state === 'Running' ? 'running' : ((job.scheduledAt < now) ? 'queued' : 'scheduled') })}/>{job.state === 'Running' ? 'Running' : 'Queued'}</td>
              <th scope="row" className={td()}><b>{job.type}</b></th>
              <td className={td({ align: 'end' })} style={{ whiteSpace: 'nowrap' }} align="right">{job.state === 'Running' ? formatTime(Math.round((now.valueOf() - job.startedAt!.valueOf()) / 1000)) : '-'}</td>
              <td className={td({ align: 'end' })}><FormatDate key={job.id} date={job.scheduledAt} relative/></td>
            </tr>
          ))}
          {active.length === 0 && scheduled.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center' }}>No jobs currently running</td></tr>}
        </tbody>
      </Table>
      <Headline id="jobs">Finished Jobs ({finished.length})</Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small>Status</Table.HeaderCell>
            <Table.HeaderCell small>Job</Table.HeaderCell>
            <Table.HeaderCell>Output</Table.HeaderCell>
            <Table.HeaderCell small align="end">Runtime</Table.HeaderCell>
            <Table.HeaderCell small align="end">Finished</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {finished.map((job) => (
            <tr key={job.id} className={tr()}>
              <td className={td()} style={{ whiteSpace: 'nowrap' }}><span className={status({ color: job.state === 'Error' ? 'error' : 'success' })}/>{job.state}</td>
              <th scope="row" className={td()}><b>{job.type}</b></th>
              <td className={td()} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{job.output}</td>
              <td className={td({ align: 'end' })} style={{ whiteSpace: 'nowrap' }}>{formatTime((job.finishedAt!.valueOf() - job.startedAt!.valueOf()) / 1000)}</td>
              <td className={td({ align: 'end' })}><FormatDate date={job.finishedAt} relative/></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}

export default JobsPage;

export const generateMetadata = createMetadata({
  title: 'Job Status',
});
