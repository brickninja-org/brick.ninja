import type { FC, ReactNode } from 'react';
import type { DataTableColumnSelectionProps } from '@brickninja-org/ui/components/table/DataTable';

import { Translate } from '@/components/i18n/Translate';

export interface ColumnSelectProps {
  table: { ColumnSelection: FC<DataTableColumnSelectionProps> };
  children?: ReactNode;
}

export const ColumnSelect: FC<ColumnSelectProps> = ({ table: { ColumnSelection }, children }) => {
  return (
    <ColumnSelection reset={<Translate id="table.columns.reset"/>}>{children ?? <Translate id="table.columns"/>}</ColumnSelection>
  );
};
