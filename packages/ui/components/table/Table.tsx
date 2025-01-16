import type { FC, ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from 'tailwind-variants';

import { cn } from '../../lib/tailwind';
import { Icon } from '../../icons';
import { TableWrapper } from './table-wrapper';

export interface TableProps extends Pick<TableVariantProps, 'layout' | 'fullWidth'> {
  children: ReactNode;
}

export interface HeaderCellProps extends TableVariantProps {
  children?: ReactNode;
  sort?: boolean | 'asc' | 'desc';
  onSort?: () => void;
}

export interface BodyRowProps {
  children: ReactNode;
}

const table = tv({
  slots: {
    base: '',
    wrapper: [],
    table: 'max-content min-w-full md:w-full border-separate border-spacing-0 border-none',
    tbody: '',
    tr: ['group/tr', 'first:border-t-0', 'outline-none'],
    th: ['group/th', 'sticky', 'top-(--table-sticky-top,48px)', 'py-2', 'px-4', 'border-b-2', 'bg-background', 'font-medium', 'text-left', 'whitespace-nowrap', 'z-1'],
    td: ['py-2 px-4', 'border-t', 'font-normal', 'leading-normal text-left', 'transition-colors duration-100 ease-linear', 'group-hover/tr:bg-gray-100', 'h-[1px]'], //set height to 1px. this get ignored by browsers, but allows childs to use height: 100%
  },
  variants: {
    layout: {
      auto: {
        table: 'table-auto',
      },
      fixed: {
        table: 'table-fixed',
      },
    },
    fullWidth: {
      true: {
        base: 'w-full',
        wrapper: 'w-full',
        table: 'w-full',
      },
    },
    align: {
      start: {
        th: 'text-start',
        td: 'text-start',
      },
      center: {
        th: 'text-center',
        td: 'text-center',
      },
      end: {
        th: 'text-end',
        td: 'text-end',
      },
    },
    small: {
      true: {
        th: 'w-[1px]',
      }
    },
  },
  defaultVariants: {
    layout: 'auto',
    fullWidth: true,
    align: 'start',
    small: false,
  },
});

export type TableVariantProps = VariantProps<typeof table>;
export type TableSlots = keyof ReturnType<typeof table>;
export type TableReturnType = ReturnType<typeof table>;

export { table };

const Table: FC<TableProps> & { HeaderCell: FC<HeaderCellProps>, BodyRow: FC<BodyRowProps> } = ({ children, layout }: TableProps) => {
  const { table: style } = table();
  return (
    <TableWrapper>
      <table className={cn([style({ layout })])}>
        {children}
      </table>
    </TableWrapper>
  );
};

Table.HeaderCell = function HeaderCell({ children, small = false, align, sort, onSort }: HeaderCellProps) {
  const { th } = table();
  return (
    <th scope="col" className={cn(th({ small, align }))} aria-sort={sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : undefined}>
      {sort ? (
        <button className={cn(['block [width:_calc(100%_+_32px)] -my-2 -mx-4 py-2 px-4 rounded-xs [text-align:inherit] cursor-pointer'])} onClick={onSort}>
          {children}
          <Icon className="inline-block ml-2 text-gray-600" icon={sort === 'desc' ? 'arrow-sort-down' : sort === 'asc' ? 'arrow-sort-up' : 'arrow-sort'}/>
        </button>
      ) : children}
    </th>
  );
};

Table.BodyRow = function BodyRow({ children }: BodyRowProps) {
  const { tr } = table();

  return (
    <tr className={cn(tr())}>
      {children}
    </tr>
  );
};

export {
  Table,
};
