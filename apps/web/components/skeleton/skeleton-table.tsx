/* eslint-disable react/no-array-index-key */
import { type FC, type ReactNode } from 'react';

import { Table } from '@brickninja-org/ui/components/table';

import { Skeleton, SkeletonLink } from '@/components/skeleton';

interface SkeletonTableProps {
  columns: ReactNode[];
  rows?: number;
  icons?: boolean;
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
            {columns.map((_, i) => (<td key={i}>{i === 0 && (icons ? <SkeletonLink/> : <Skeleton/>)}</td>))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
