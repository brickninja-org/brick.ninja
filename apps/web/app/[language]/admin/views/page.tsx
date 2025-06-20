import type { PageProps } from '@/lib/next';

import { cache } from 'react';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Switch } from '@brickninja-org/ui/components/form/Switch';

import { db } from '@/lib/prisma';
import { PageLayout } from '@/components/layout/PageLayout';
import { ensureUserIsAdmin } from '../admin';
import { Chart } from '@/components/chart/Chart';
import { Table } from '@brickninja-org/ui/components/table/Table';

type Interval = 'hour' | 'day';
type Days = '7' | '30';

const getViews = cache(async function getViews(interval: Interval, days: Days) {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - Number(days));

  const intervalSize = interval === 'hour' ? '1 hour' : '1 day';

  const [views, mostViewed] = await Promise.all([
    // db.pageView_daily.groupBy({
    //   by: 'bucket',
    //   _sum: { count: true },
    //   where: { bucket: { gte: sevenDaysAgo }},
    //   orderBy: { bucket: 'desc' },
    // }),
    db.$queryRaw<{ time: Date, value: number }[]>`
      SELECT
        time_bucket_gapfill(${intervalSize}::INTERVAL, time) AS "time",
        COUNT(*)::int AS "value"
      FROM "PageView"
      WHERE time >= ${daysAgo} AND time <= NOW()
      GROUP BY 1
      ORDER BY 1`,
    db.pageView_daily.groupBy({
      by: ['page', 'pageId'],
      _sum: { count: true },
      where: { bucket: { gte: daysAgo }},
      orderBy: { _sum: { count: 'desc' }},
      take: 25,
    }),
  ]);

  return { views, mostViewed };
});

export default async function AdminViewsPage({ searchParams }: PageProps) {
  await ensureUserIsAdmin();

  const { interval: intervalParam, days: daysParam } = await searchParams;
  const interval = (['hour', 'day']).includes(intervalParam as string) ? intervalParam as 'hour' | 'day' : 'hour';
  const days = (['7', '30']).includes(daysParam as string) ? daysParam as '7' | '30' : '7';

  const { views, mostViewed } = await getViews(interval, days);

  return (
    <PageLayout>
      <Headline id="views" actions={[
        <Switch key="days">
          <Switch.Control type="link" replace href={`?interval=${interval}&days=7`} active={days === '7'}>1 Week</Switch.Control>
          <Switch.Control type="link" replace href={`?interval=${interval}&days=30`} active={days === '30'}>1 Month</Switch.Control>
        </Switch>,
        <Switch key="interval">
          <Switch.Control type="link" replace href={`?interval=hour&days=${days}`} active={interval === 'hour'}>Hourly</Switch.Control>
          <Switch.Control type="link" replace href={`?interval=day&days=${days}`} active={interval === 'day'}>Daily</Switch.Control>
        </Switch>
      ]}
      >
        Page Views (last {days} days)
      </Headline>
      <Chart lines={[['Page Views', views]]}/>

      <Headline id="most-viewed">
        Most Viewed Pages
      </Headline>
      <Table>
        <thead>
          <tr>
            <th>Page</th>
            <th>ID</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {mostViewed.map((view) => (
            <tr key={`${view.page}-${view.pageId}`}>
              <td>{view.page}</td>
              <td>{view.pageId}</td>
              <td>{view._sum.count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Page Views',
};
