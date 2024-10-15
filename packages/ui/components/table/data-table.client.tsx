'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState, type FC, type ReactNode, type ThHTMLAttributes } from 'react';

import { Dropdown } from '../dropdown';
import { Button } from '../form/button';
import { Checkbox } from '../form/checkbox';
import { MenuList } from '../layout/menu-list';
import { DataTableGlobalContext, type AvailableColumn } from './data-table-context';
import { Table, type HeaderCellProps } from './table';
import { Separator } from '../layout/separator';

type DataTableContext = { id: string, sortBy: string | undefined, sortOrder: 'asc' | 'desc', visibleColumns: string[] };

const defaultDataTableContext: DataTableContext = { id: '', sortBy: undefined, sortOrder: 'asc', visibleColumns: [] };
const DataTableContext = createContext<{ state: DataTableContext, setState: (state: Partial<DataTableContext>) => void }>({ state: defaultDataTableContext, setState: () => {} });
DataTableContext.displayName = 'DataTableContext';

export interface DataTableClientProps {
  children: ReactNode;
  id: string;
  columns: AvailableColumn[];
}

export const DataTableClient: FC<DataTableClientProps> = ({ children, id, columns }) => {
  const [state, setStateInternal] = useState({ ...defaultDataTableContext, id, visibleColumns: columns.filter((column) => !column.hidden).map(({ id }) => id) });
  const { currentColumns, currentAvailableColumns } = useCurrentColumns(id);
  const { setAvailableColumns } = use(DataTableGlobalContext);

  const setState = useCallback((update: Partial<DataTableContext>) => {
    setStateInternal((currentState) => ({ ...currentState, ...update }));
  }, []);

  useEffect(() => setAvailableColumns(id, columns), [setAvailableColumns, id, columns]);
  useEffect(() => {
    if (columns === currentAvailableColumns) {
      setStateInternal((state) => ({ ...state, visibleColumns: currentColumns }));
    }
  }, [currentColumns, columns, currentAvailableColumns]);

  return (
    <DataTableContext.Provider value={{ state, setState }}>
      {children}
    </DataTableContext.Provider>
  );
};

export interface DataTableClientRowsProps {
  children: ReactNode[];
  sortableColumns: Record<string, number[]>;
}

export const DataTableClientRows: FC<DataTableClientRowsProps> = ({ children, sortableColumns }) => {
  const { sortBy, sortOrder } = use(DataTableContext).state;

  if (sortBy && sortableColumns[sortBy]) {
    const sortedChildren = sortableColumns[sortBy].map((index) => children[index]);

    if (sortOrder === 'desc') {
      sortedChildren.reverse();
    }

    return sortedChildren;
  }

  return children;
};

export interface DataTableClientColumnProps extends Pick<HeaderCellProps, 'align' | 'small'> {
  id: string;
  children: ReactNode;
  sortable: boolean;
}

export const DataTableClientColumn: FC<DataTableClientColumnProps> = ({ id, children, sortable, ...props }) => {
  const { state: { sortBy, sortOrder, visibleColumns }, setState } = use(DataTableContext);
  const isVisible = visibleColumns.includes(id);

  const handleSort = useCallback(() => {
    setState({
      sortBy: sortBy === id && sortOrder === 'desc' ? undefined : id,
      sortOrder: sortBy === id ? sortOrder === 'asc' ? 'desc' : 'asc' : 'asc',
    });
  }, [id, sortBy, sortOrder, setState]);

  if (!isVisible) {
    return null;
  }

  return <Table.HeaderCell sort={sortable ? (sortBy === id ? sortOrder : true) : false} onSort={handleSort} {...props}>{children}</Table.HeaderCell>;
};

export interface DataTableClientCellProps {
  columnId: string;
  align: ThHTMLAttributes<HTMLTableCellElement>['align'];
  children: ReactNode;
}

export const DataTableClientCell: FC<DataTableClientCellProps> = ({ columnId, children, align }) => {
  const { state: { visibleColumns }} = use(DataTableContext);
  const isVisible = visibleColumns.includes(columnId);

  return <td hidden={!isVisible} align={align}>{children}</td>;
};

export interface DataTableClientColumnSelectionProps {
  id: string;
  children: ReactNode;
  reset: ReactNode;
}

export const DataTableClientColumnSelection: FC<DataTableClientColumnSelectionProps> = ({ id, reset, children }) => {
  const { columns, setColumns } = use(DataTableGlobalContext);
  const { currentAvailableColumns, currentColumns } = useCurrentColumns(id);

  return (
    <Dropdown button={<Button icon="table-insert-column">{children}</Button>} preferredPlacement="right-start">
      <MenuList>
        {currentAvailableColumns.filter((column) => !column.fixed).map((column) => (
          <Checkbox key={column.id} checked={currentColumns.includes(column.id)} onChange={(checked) => setColumns(id, currentAvailableColumns.map(({ id }) => id).filter((id) => id === column.id ? checked : currentColumns.includes(id)))}>{column.title}</Checkbox>
        ))}
        <Separator/>
        <Button appearance="menu" onClick={() => setColumns(id, undefined)} disabled={columns[id] === undefined}>{reset}</Button>
      </MenuList>
    </Dropdown>
  );
};

const useCurrentColumns = (id: string) => {
  const { columns, availableColumns } = use(DataTableGlobalContext);

  return useMemo(() => {
    const currentAvailableColumns = availableColumns[id] ?? [];
    const defaultColumns = currentAvailableColumns.filter((column) => !column.hidden).map(({ id }) => id);
    const currentColumns = columns[id] ?? defaultColumns;

    return { currentAvailableColumns, defaultColumns, currentColumns };
  }, [availableColumns, columns, id]);
};
