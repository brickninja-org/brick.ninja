import { db } from '@/lib/prisma';

import { cache, Suspense } from 'react';
import { ensureUserIsAdmin } from '../admin';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';
import { PageLayout } from '@/components/layout/PageLayout';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Skeleton } from '@/components/skeleton/Skeleton';
import { ColumnSelect } from '@/components/table/ColumnSelect';
import { Code } from '@/components/layout/Code';
import { List } from '@brickninja-org/ui/components/layout/List';
import { FormatNumber } from '@/components/format/FormatNumber';
import { FormatDate } from '@/components/format/FormatDate';

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
        Charts
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

export const metadata = {
  title: 'Applications',
};
