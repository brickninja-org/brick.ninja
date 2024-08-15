import type { FC, ReactNode, ThHTMLAttributes } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
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
  base: 'w-full',
  variants: {
    width: {
      auto: 'w-auto',
      page: 'max-w-full',
    },
  },
  defaultVariants: {
    width: 'page',
  },
});

export type TableVariants = VariantProps<typeof tableStyles>;

const thStyles = tv({
  base: 'px-4 py-2',
  variants: {
    small: {
      true: 'width-[1px]',
    },
  },
  defaultVariants: {
    small: false,
  },
});

export type HeaderCellVariants = VariantProps<typeof thStyles>;

const Table: FC<TableProps> & {HeaderCell: FC<HeaderCellProps>} = ({ children, width = 'page' }) => (
  <TableWrapper>
    <table className={tableStyles({ width })}>
      {children}
    </table>
  </TableWrapper>
);

Table.HeaderCell = function HeaderCell({ children, small = false, align, sort, onSort }) {
  return (
    <th className={thStyles({ small })} align={align} aria-sort={sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : undefined}>
      {sort ? (
        <button onClick={onSort}>
          {children}
        </button>
      ) : children}
    </th>
  );
};

export {
  Table
};
