import type { FC, ReactNode, ThHTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '../../lib/tailwind';
import { TableWrapper } from './table-wrapper';

export interface TableProps extends TableVariants {
  children: ReactNode;
}

export interface HeaderCellProps extends HeaderCellVariants {
  children?: ReactNode;
  align?: ThHTMLAttributes<HTMLTableCellElement>['align'];
  sort?: boolean | 'asc' | 'desc';
  onSort?: () => void;
}

const tableStyles = tv({
  variants: {
    width: {
      auto: 'w-auto',
    },
  },
});

export type TableVariants = VariantProps<typeof tableStyles>;

const thStyles = tv({
  variants: {
    small: {
      true: 'width-[1px]',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
      char: 'text-center',
    },
  },
  defaultVariants: {
    small: false,
  },
});

export type HeaderCellVariants = VariantProps<typeof thStyles>;

const Table: FC<TableProps> & { HeaderCell: FC<HeaderCellProps> } = ({ children, width }) => (
  <TableWrapper>
    <table className={cn(['table', tableStyles({ width })])}>
      {children}
    </table>
  </TableWrapper>
);

Table.HeaderCell = function HeaderCell({ children, small = false, align, sort, onSort }) {
  return (
    <th className={cn(thStyles({ small }))} align={align} aria-sort={sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : undefined}>
      {sort ? (
        <button className={cn(['block [width:_calc(100%_+_32px)] -my-2 -mx-4 py-2 px-4 rounded-sm [text-align:_inherit]'])} onClick={onSort}>
          {children}
        </button>
      ) : children}
    </th>
  );
};

export {
  Table
};
