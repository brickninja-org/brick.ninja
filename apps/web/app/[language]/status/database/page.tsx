import type { ReactNode } from 'react';

import { Prisma } from '@brickninja-org/database';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { FormatNumber } from '@/components/format/FormatNumber';
import { PageLayout } from '@/components/layout/PageLayout';

const getDatabaseStats = cache(() => {
  const hypertables = ['PageView'];

  return Promise.all([
    db.$queryRaw<{ table_name: string, size: bigint, size_index: bigint, size_total: bigint, rows: number }[]>`
      SELECT * FROM (
        SELECT
          relname AS table_name,
          pg_table_size(c.oid) as size,
          pg_indexes_size(c.oid) AS size_index,
          pg_total_relation_size(c.oid) AS size_total,
          reltuples as rows
        FROM pg_class c
        JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE relkind = 'r' AND nspname = CURRENT_SCHEMA AND relname NOT LIKE 'User%' AND relname NOT IN (${Prisma.join(hypertables)})
        UNION SELECT 'PageView' as table_name, table_bytes as size, index_bytes as size_index, total_bytes as size_total, approximate_row_count('"PageView"') as rows FROM hypertable_detailed_size('"PageView"')
      )
      ORDER BY table_name;`,
    db.$queryRaw<[{ size: string }]>`SELECT pg_size_pretty(pg_database_size(current_database())) as size;`
  ]);
}, ['db-stats'], { revalidate: 60 });

export default async function StatusDatabasePage() {
  const [stats, total] = await getDatabaseStats();

  const DatabaseStats = createDataTable(stats, (row) => row.table_name);

  return (
    <PageLayout>
      <Headline id="db">Database</Headline>
      <p>Total size: {total[0].size}.</p>

      <DatabaseStats.Table>
        <DatabaseStats.Column id="table" title="Table">
          {({ table_name }) => table_name}
        </DatabaseStats.Column>
        <DatabaseStats.Column id="rows" align="end" title="Row Estimate" sortBy="rows">
          {({ rows }) => rows === -1 ? <span className="text-gray-600">?</span> : <FormatNumber value={rows}/>}
        </DatabaseStats.Column>
        <DatabaseStats.Column id="data" align="end" title="Size (Data)" sortBy="size">
          {({ size }) => formatSize(size)}
        </DatabaseStats.Column>
        <DatabaseStats.Column id="index" align="end" title="Size (Index)" sortBy="size_index">
          {({ size_index }) => formatSize(size_index)}
        </DatabaseStats.Column>
        <DatabaseStats.Column id="total" align="end" title="Size (Total)" sortBy="size_total">
          {({ size_total }) => formatSize(size_total)}
        </DatabaseStats.Column>
      </DatabaseStats.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Database Status'
};

function formatSize(size: bigint | null): ReactNode {
  if(size === null) {
    return '?';
  }

  const units = ['bytes', 'kB', 'MB', 'GB', 'TB'];

  while(size > 8192) {
    size /= BigInt(1024);
    units.shift();
  }

  return <FormatNumber value={size} unit={units[0]} variant="tabular-nums"/>;
}
