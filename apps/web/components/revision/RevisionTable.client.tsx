'use client';

import type { FC, ReactNode } from 'react';

import { useState } from 'react';
import { Icon } from '@brickninja-org/ui/icons';
import { TableRowButton } from '@brickninja-org/ui/components/table/TableRowButton';

export interface RevisionTableHiddenRowsProps {
  label: string;
  hiddenIndexes: number[];
  children: ReactNode[];
}

export const RevisionTableHiddenRows: FC<RevisionTableHiddenRowsProps> = ({ label, hiddenIndexes, children }) => {
  const [showHidden, setShowHidden] = useState(false);

  if (showHidden || hiddenIndexes.length === 0) {
    return children;
  }

  // only return children that are not hidden
  return [
    children.filter((row, i) => !hiddenIndexes.includes(i)),
    <TableRowButton key="expand" onClick={() => setShowHidden(true)}>
      <Icon icon="chevron-down"/> {label.replace('{0}', hiddenIndexes.length.toString())}
    </TableRowButton>
  ];
};
