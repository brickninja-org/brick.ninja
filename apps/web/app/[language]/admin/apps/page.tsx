import type { FC } from 'react';

import { cache, Suspense } from 'react';
import { groups } from 'd3-array';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { List } from '@brickninja-org/ui/components/layout/List';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { Chart, getColor } from '@/components/chart/Chart';
import { FormatNumber } from '@/components/format/FormatNumber';
import { FormatDate } from '@/components/format/FormatDate';
import { PageLayout } from '@/components/layout/PageLayout';
import { Code } from '@/components/layout/Code';
import { Skeleton } from '@/components/skeleton/Skeleton';
import { ColumnSelect } from '@/components/table/ColumnSelect';
import { ensureUserIsAdmin } from '../admin';

const getApplications = cache(() => {
  const lastDay = new Date();
  lastDay.setHours(lastDay.getHours() - 24);

  return db.application.findMany({
    include: {
      owner: { select: { name: true }},
      _count: { select: { requests: { where: { time: { gte: lastDay }}}}},
    },
    orderBy: { createdAt: 'asc' },
  });
});

export default async function AdminAppsPage() {
  await ensureUserIsAdmin();
  const apps = await getApplications();
  const Apps = createDataTable(apps, ({ id }) => id);

  return (
    <PageLayout>
      <Headline id="requests">API Requests</Headline>

      <Suspense fallback={<Skeleton height={300} width="100%"/>}>
        <RequestsChart/>
      </Suspense>

      <Headline id="apps" actions={<ColumnSelect table={Apps}/>}>Applications ({apps.length})</Headline>
      <Apps.Table>
        <Apps.Column id="name" title="Name" sortBy="name">
          {({ name }) => name}
        </Apps.Column>
        <Apps.Column id="owner" title="Owner" sortBy={({ owner }) => owner.name}>
          {({ owner }) => owner.name}
        </Apps.Column>
        <Apps.Column id="apiKey" title="API Key">
          {({ apiKey }) => <Code inline>{apiKey}</Code>}
        </Apps.Column>
        <Apps.Column id="origins" title="Origins" sortBy={({ origins }) => origins.length} hidden>
          {({ origins }) => <List>{origins.map((origin) => <li key={origin}>{origin}</li>)}</List>}
        </Apps.Column>
        <Apps.Column id="requests" align="end" title="Requests (24h)" sortBy={({ _count }) => _count.requests}>
          {({ _count }) => <FormatNumber value={_count.requests}/>}
        </Apps.Column>
        <Apps.Column id="createdAt" align="end" title="Created At" sortBy="createdAt">
          {({ createdAt }) => <FormatDate date={createdAt}/>}
        </Apps.Column>
      </Apps.Table>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Applications',
});

const RequestsChart: FC = async () => {
  const requests = await db.$queryRaw<{ time: Date, endpoint: string, value: number }[]>`
      SELECT
        time_bucket_gapfill('1 hour'::INTERVAL, time) AS "time",
        endpoint,
        COUNT(*)::int AS "value"
      FROM "ApplicationApiRequest"
      WHERE time >= NOW() - '7 day'::INTERVAL  AND time <= NOW()
      GROUP BY 1, 2
      ORDER BY 1`;

  const byEndpoint = groups(requests, ({ endpoint }) => endpoint);

  return (
    <FlexRow>
      <Chart lines={byEndpoint}/>

      <div>
        <Table>
          <thead>
            <tr><th>Endpoint</th><th align="right">Count</th></tr>
          </thead>
          <tbody>
            {byEndpoint.map(([endpoint, data], index) => (
              <tr key={endpoint}>
                <th><span style={{ backgroundColor: getColor(index), width: 8, height: 8, borderRadius: 8, display: 'inline-block' }}/> {endpoint}</th>
                <td align="right"><FormatNumber value={data.reduce((total, { value }) => total + value, 0)}/></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </FlexRow>
  );
};
