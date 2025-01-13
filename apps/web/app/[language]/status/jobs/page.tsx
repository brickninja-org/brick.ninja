import { tv, type VariantProps } from 'tailwind-variants';

import { Headline } from '@brickninja-org/ui/components/headline';
import { table, Table } from '@brickninja-org/ui/components/table';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/format/format-date';
import { FormatNumber } from '@/components/format/format-number';
import { PageLayout } from '@/components/layout/page-layout';
import { ReloadCheckbox } from '@/components/reload/reload-checkbox';

const status = tv({
  base: 'mr-2 w-2.5 h-2.5 inline-block rounded-[5px]',
  variants: {
    color: {
      success: 'bg-green-600',
      error: 'bg-red-500',
      default: 'bg-blue-500',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

export type StatusVariants = VariantProps<typeof status>;

const getJobs = cache(async () => {
  const [running, finished] = await Promise.all([
    db.job.findMany({ where: { OR: [{ state: { in: ['Running', 'Queued'] }}, { cron: { not: '' }}] }, orderBy: [{ priority: 'desc' }, { scheduledAt: 'asc' }] }),
    db.job.findMany({ where: { state: { notIn: ['Running', 'Queued'] }}, orderBy: { finishedAt: 'desc' }, take: 100 }),
  ]);

  return { running, finished, now: new Date() };
}, ['jobs'], { revalidate: 1 });

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
  const { running, finished, now } = await getJobs();

  const { td, tr } = table();

  return (
    <PageLayout>
      <Headline id="jobs" actions={<ReloadCheckbox intervalMs={1000}/>}>
        Active Jobs ({running.length})
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
          {running.map((job) => (
            <tr key={job.id} className={tr()}>
              <td className={td()} style={{ whiteSpace: 'nowrap' }}><span className={status({ color: job.state === 'Running' ? 'success' : 'default' })}/>{job.state === 'Running' ? 'Running' : 'Queued'}</td>
              <th scope="row" className={td()}><b>{job.type}</b></th>
              <td className={td({ align: 'end' })} style={{ whiteSpace: 'nowrap' }} align="right">{job.state === 'Running' ? formatTime(Math.round((now.valueOf() - job.startedAt!.valueOf()) / 1000)) : '-'}</td>
              <td className={td({ align: 'end' })}><FormatDate key={job.id} date={job.scheduledAt} relative/></td>
            </tr>
          ))}
          {running.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center' }}>No jobs currently running</td></tr>}
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

export const metadata = {
  title: 'Job Status',
};
