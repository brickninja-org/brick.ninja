import { Fragment } from 'react';

import type { ApiRequest } from '@brickninja-org/database';
import { cn } from '@brickninja-org/ui/lib';
import { Headline } from '@brickninja-org/ui/components/headline';
import { table, Table } from '@brickninja-org/ui/components/table';

import { db } from '@/lib/prisma';
import { FormatNumber } from '@/components/format/format-number';
import { PageLayout } from '@/components/layout/page-layout';
import { ReloadCheckbox } from '@/components/reload/reload-checkbox';

import { availablePeriods } from './available-periods';
import type { PageProps } from '@/lib/next';

async function getData(hours: number) {
  const now = new Date();

  const past = new Date();
  past.setHours(now.getHours() - hours);

  const apiRequests = await db.apiRequest.findMany({ where: { createdAt: { gte: past }}, orderBy: { createdAt: 'desc' }});

  const endpoints: Record<string, { totalResponseTimeMs: number, requestCount: number, errors: number, lastRequests: boolean[], requests: ApiRequest[] }> = {};
  const statusCodes: Record<number, number> = {};
  let errors = 0;

  apiRequests.forEach((request) => {
    if (!endpoints[request.endpoint]) {
      endpoints[request.endpoint] = { totalResponseTimeMs: 0, requestCount: 0, errors: 0, lastRequests: [], requests: [] };
    }

    endpoints[request.endpoint].requests.push(request);
    endpoints[request.endpoint].totalResponseTimeMs += request.responseTimeMs;
    endpoints[request.endpoint].requestCount++;
    statusCodes[request.status] = (statusCodes[request.status] ?? 0) + 1;

    if (request.status !== 200) {
      errors++;
      endpoints[request.endpoint].errors++;
    }

    if (endpoints[request.endpoint].lastRequests.length < 100) {
      endpoints[request.endpoint].lastRequests.push(request.status === 200);
    }
  });

  return { total: apiRequests.length, errors, endpoints, statusCodes, apiRequests };
}

export default async function StatusApiPage({ searchParams }: PageProps) {
  const { period } = await searchParams;
  const hours = availablePeriods.find(({ value }) => value == period)?.hours ?? 24;

  const { endpoints, errors, total, statusCodes } = await getData(hours);

  const { td, th, tr } = table();

  return (
    <PageLayout>
      <Headline
        id="api-status"
        actions={[
          <ReloadCheckbox key="reload" intervalMs={1000 * 60}/> // 1 minute
        ]}
      >
        Brickset API status
      </Headline>

      <p>
        <FormatNumber value={total}/> requests and <FormatNumber value={errors}/> errors (<FormatNumber value={errors / total * 100} unit="%"/>) in the last {hours} hours.
      </p>

      <Headline id="status-codes">Status Codes ({hours}h)</Headline>
      <div className="grid [grid-template-columns:_auto_1fr]">
        {Object.entries(statusCodes).map(([statusCode, amount]) => (
          <Fragment key={statusCode}>
            <div className="p-2 border-r-2 font-medium">{statusCode}</div>
            <div className="relative flex items-center p-2">
              <div style={{ width: `${amount / total * 100}%` }} className={cn(['h-4 rounded-xs', statusCode === '200' ? 'bg-green-600' : 'bg-red-600'])}/>
              <div className="ml-2">{amount}</div>
            </div>
          </Fragment>
        ))}
      </div>

      <Headline id="endpoints">Endpoints ({hours}h)</Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Endpoint</Table.HeaderCell>
            <Table.HeaderCell align="end">Avg. Response Time</Table.HeaderCell>
            <Table.HeaderCell align="end">Requests</Table.HeaderCell>
            <Table.HeaderCell>Errors</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {Object.entries(endpoints).sort(([a], [b]) => a.localeCompare(b)).map(([ endpoint, data ]) => (
            <tr key={endpoint} className={tr()}>
              <th className={th()}>{endpoint}</th>
              <td className={td({ align: 'end' })}>
                <FormatNumber value={Math.round(data.totalResponseTimeMs / data.requestCount)} unit="ms"/>
              </td>
              <td className={td({ align: 'end' })}>
                <FormatNumber value={data.requestCount}/>
              </td>
              <td className={td()}>
                <FormatNumber value={data.errors}/> (<FormatNumber value={data.errors / data.requestCount * 100} unit="%"/>)
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </PageLayout>
  );
}
