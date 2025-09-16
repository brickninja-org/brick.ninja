import type { FC, ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';

import { tv } from 'tailwind-variants';

import { cn } from '../../lib/tailwind';
import { Icon } from '../../icons';
import { TableWrapper } from './TableWrapper';
import type { RefProp } from '../../lib/react';

export interface TableProps extends RefProp<HTMLTableElement>, Pick<TableVariantProps, 'layout' | 'fullWidth'> {
  children: ReactNode,
}

export interface HeaderCellProps extends TableVariantProps {
  children?: ReactNode,
  colSpan?: number,
  width?: number | string,
  sort?: boolean | 'asc' | 'desc',
  onSort?: () => void,
}

export interface BodyRowProps {
  children: ReactNode,
}

const table = tv({
  slots: {
    base: '',
    wrapper: [],
    table: 'max-content min-w-full md:w-full border-separate border-spacing-0 border-none scroll-mt-8',
    tbody: '',
    tr: ['group/tr', 'first:border-t-0', 'outline-none'],
    th: ['group/th', 'sticky', 'top-(--table-sticky-top,_48px)', 'py-2', 'px-4', 'border-b-2', 'bg-background', 'font-medium', 'text-left', 'whitespace-nowrap', 'z-1'],
    td: ['py-2 px-4', 'border-t', 'font-normal', 'leading-normal text-left', 'transition-colors duration-100 ease-linear', 'group-hover/tr:bg-background-light', 'h-0.25'], //set height to 1px. this get ignored by browsers, but allows childs to use height: 100%
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
        th: 'w-0.25',
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

const TableComponent: FC<TableProps> = ({ children, layout, ref }: TableProps) => {
  const { table: style } = table();
  return (
    <TableWrapper>
      <table className={cn([style({ layout })])} ref={ref}>
        {children}
      </table>
    </TableWrapper>
  );
};

TableComponent.displayName = 'Table';

const HeaderCell = function HeaderCell({ children, small = false, align, colSpan, sort, width, onSort }: HeaderCellProps) {
  const { th } = table();
  return (
    <th scope="col" colSpan={colSpan} className={cn(th({ small, align }))} aria-sort={sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : undefined} style={width ? { width } : undefined} onClick={onSort}>
      {sort ? (
        <button className={cn(['block [width:calc(100%+32px)] -my-2 -mx-4 py-2 px-4 rounded-xs [text-align:inherit] cursor-pointer'])} onClick={onSort}>
          {children}
          <Icon className="inline-block ml-2 text-muted" icon={sort === 'desc' ? 'sort-desc' : sort === 'asc' ? 'sort-asc' : 'sort'}/>
        </button>
      ) : children}
    </th>
  );
};

HeaderCell.displayName = 'Table.HeaderCell';

const BodyRow = function BodyRow({ children }: BodyRowProps) {
  const { tr } = table();

  return (
    <tr className={cn(tr())}>
      {children}
    </tr>
  );
};

BodyRow.displayName = 'Table.BodyRow';

export const Table = Object.assign(TableComponent, { HeaderCell, BodyRow });
