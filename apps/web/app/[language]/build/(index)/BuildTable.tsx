'use client';

import type { FC } from 'react';
import type { Build } from '@brickninja-org/database';
import { useDataTable, type DataTableColumn } from '@brickninja-org/ui/components/table/use-datatable';

import { useCallback, useMemo } from 'react';
import Link from 'next/link';

import { FormatNumber } from '@/components/format/FormatNumber';
import { FormatDate } from '@/components/format/FormatDate';
import { useFormatContext } from '@/components/format/Format.context';

type Update = { entity: string | null, buildId: number, _count: { _all: number }};
type BuildWithUpdates = { build: Build, updates: Update[] };

function updateCount(updates: Update[], type: string): number {
  return updates.find((u) => u.entity === type)?._count._all ?? 0;
}

const buildTableColumns: DataTableColumn<BuildWithUpdates>[] = [
  { key: 'id', label: 'Build', value: ({ build }) => <Link href={`/build/${build.id}`}>{build.id}</Link> },
  { key: 'items', label: 'Item Updates', value: ({ updates }) => <FormatNumber value={updateCount(updates, 'Item')}/>, sort: (a, b) => updateCount(a.updates, 'Item') - updateCount(b.updates, 'Item') },
  { key: 'products', label: 'Product Updates', value: ({ updates }) => <FormatNumber value={updateCount(updates, 'Product')}/>, sort: (a, b) => updateCount(a.updates, 'Product') - updateCount(b.updates, 'Product') },
  { key: 'designs', label: 'Design Updates', value: ({ updates }) => <FormatNumber value={updateCount(updates, 'Design')}/>, sort: (a, b) => updateCount(a.updates, 'Design') - updateCount(b.updates, 'Design') },
  { key: 'colors', label: 'Color Updates', value: ({ updates }) => <FormatNumber value={updateCount(updates, 'Color')}/>, sort: (a, b) => updateCount(a.updates, 'Color') - updateCount(b.updates, 'Color') },
  { key: 'created', label: 'Date', value: ({ build }) => <FormatDate date={build.createdAt}/>, small: true },
];

const buildRowKey = ({ build }: BuildWithUpdates) => build.id;

export interface BuildTableProps {
  rows: BuildWithUpdates[],
}

export const BuildTable: FC<BuildTableProps> = ({ rows }) => {
  const { locale } = useFormatContext();
  const f = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }), [locale]);

  const group = useCallback(
    ({ build }: BuildWithUpdates) => ({ value: `${build.createdAt.getMonth()}-${build.createdAt.getFullYear()}`, label: <strong>{f.format(build.createdAt)}</strong> }),
    [f],
  );

  // TODO: replace with @brickninja-org/ui DataTable
  const BuildTable = useDataTable<BuildWithUpdates>(buildTableColumns, buildRowKey, group);

  return <BuildTable rows={rows}/>;
};
