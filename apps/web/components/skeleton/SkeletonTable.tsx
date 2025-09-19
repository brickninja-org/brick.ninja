/* eslint-disable react/no-array-index-key */
import type { FC, ReactNode } from 'react';

import { Skeleton } from '@heroui/react';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { SkeletonLink } from '@/components/skeleton';

interface SkeletonTableProps {
  columns: ReactNode[],
  rows?: number,
  icons?: boolean,
}

export const SkeletonTable: FC<SkeletonTableProps> = ({ columns, rows = 3, icons = false }) => {
  return (
    <Table>
      <thead>
        <tr>
          {columns.map((col, i) => (<th key={i}>{col}</th>))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows).keys()].map((row) => (
          <tr key={row}>
            {columns.map((_, i) => (<td key={i}>{i === 0 && (icons ? <SkeletonLink/> : <Skeleton className="h-4 w-full"/>)}</td>))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
