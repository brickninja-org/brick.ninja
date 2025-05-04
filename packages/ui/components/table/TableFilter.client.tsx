'use client';

import type { FC, ReactNode } from 'react';
import type { TableFilterSearchIndex } from './TableFilter';
import type { DataTableRowFilterComponent, DataTableRowFilterComponentProps } from './DataTable';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Dropdown } from '../dropdown/Dropdown';
import { Button } from '../form/Button';
import { MenuList } from '../layout/MenuList';
import { Checkbox } from '../form/Checkbox';
import { FlexRow } from '../flex-row/FlexRow';
import { Separator } from '../layout/Separator';
import { cn } from '../../lib';
import { TextInput } from '../form/TextInput';

interface TableFilterContext {
  filteredRows?: number[] | undefined;
  filterMap: Map<number | string, { name: string, rowIndexes: number[] }>;

  filterIds: (number | string)[];
  setFilterIds: (filterIds: (number | string)[]) => void;

  searchIndex?: TableFilterSearchIndex;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const context = createContext<TableFilterContext>({
  filteredRows: undefined,
  filterMap: new Map(),
  filterIds: [],
  setFilterIds: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
});

export interface TableFilterDefinition {
  id: number | string;
  name: string;
  rowIndexes: number[];
}

export interface TableFilterProviderProps {
  filter: TableFilterDefinition[];
  searchIndex?: TableFilterSearchIndex;
  children: ReactNode;
  language: string;
}

export const TableFilterProvider: FC<TableFilterProviderProps> = ({ filter, searchIndex, children, language }) => {
  const filterMap = new Map(filter.map(({ id, ...filter }) => [id, filter]));
  const allFilterIds = filter.map(({ id }) => id);

  const [filterIds, setFilterIds] = useState(allFilterIds);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRowsBySearch = (searchIndex !== undefined && searchQuery !== '')
    ? Object.entries(searchIndex).map(([string, indexes]) => string.toLocaleLowerCase(language).includes(searchQuery.toLocaleLowerCase(language)) ? indexes : []).flat(1)
    : undefined;

  const filteredRowsByFilter = filterIds.length !== allFilterIds.length
    ? filterIds.flatMap((id) => filterMap.get(id)?.rowIndexes ?? [])
    : undefined;

  const filteredRows = filteredRowsBySearch === undefined && filteredRowsByFilter === undefined
    ? undefined
    : filteredRowsBySearch === undefined ? filteredRowsByFilter : filteredRowsByFilter === undefined ? filteredRowsBySearch : filteredRowsBySearch.filter((index) => filteredRowsByFilter.includes(index));

  return (
    <context.Provider value={{ filteredRows, filterIds, setFilterIds, filterMap, searchIndex, searchQuery, setSearchQuery }}>
      {children}
    </context.Provider>
  );
};

export const TableFilterRow: DataTableRowFilterComponent = ({ children, index }: DataTableRowFilterComponentProps) => {
  const { filteredRows } = useContext(context);
  const isVisible = filteredRows === undefined || filteredRows.includes(index);

  return <tr hidden={!isVisible}>{children}</tr>;
};

export interface TableFilterButtonProps {
  totalCount: number;
  children: ReactNode;
  all: ReactNode;
}

export const TableFilterButton: FC<TableFilterButtonProps> = ({ totalCount: count, children, all }) => {
  const { filterMap, filterIds, setFilterIds } = useContext(context);

  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // track shift key state
  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };
    const keyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', keyDown, { passive: true });
    window.addEventListener('keyup', keyUp, { passive: true });

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  }, []);

  const handleFilterChange = useCallback((filterId: number | string) => {
    // check if shift is pressed
    if (isShiftPressed) {
      if (filterIds.length === 1 && filterIds[0] === filterId) {
        // if the clicked filter is the only active filter, invert all filters (select all except the clicked one)
        setFilterIds(Array.from(filterMap.keys()).filter((filter) => filter !== filterId));
      } else {
        // if the clicked filter is not the only active filter, select only the clicked filter
        setFilterIds([filterId]);
      }
    } else {
      // if shift is not pressed, toggle the clicked filter
      setFilterIds(toggleArray(filterIds, filterId));
    }
  }, [filterIds, filterMap, isShiftPressed, setFilterIds]);

  return (
    <Dropdown button={<Button icon={filterMap.size === filterIds.length ? 'filter' : 'filter-active'}>{children}</Button>} preferredPlacement="bottom">
      <MenuList>
        <Checkbox checked={filterIds.length > 0} indeterminate={filterIds.length < filterMap.size && filterIds.length > 0} onChange={() => setFilterIds(filterIds.length > 0 ? [] : Array.from(filterMap.keys()))}>
          <FlexRow align="between">
            {all}
            <span className="pl-2">{count}</span>
          </FlexRow>
        </Checkbox>
        <Separator/>
        {Array.from(filterMap.entries()).map(([filterId, filter]) => (
          <Checkbox key={filterId} checked={filterIds.includes(filterId)} onChange={() => handleFilterChange(filterId)}>
            <FlexRow align="between">
              <span>{filter.name}</span>
              <span className={cn('pl-2', filter.rowIndexes.length === 0 ? 'text-muted' : undefined)}>{filter.rowIndexes.length ?? 0}</span>
            </FlexRow>
          </Checkbox>
        ))}
        <Separator/>
        <span className="py-2 px-4 text-muted">Tip: Hold <kbd className="py-0.25 px-0.75 border rounded-xs border-gray-300">⇧ Shift</kbd> to select a single filter.</span>
      </MenuList>
    </Dropdown>
  );
};

function toggleArray<T>(array: T[], value: T): T[] {
  const withoutValue = array.filter((v) => v !== value);
  return withoutValue.length === array.length ? [...array, value] : withoutValue;
}

export interface TableSearchInputProps {
  placeholder?: string;
}

export const TableSearchInput: FC<TableSearchInputProps> = ({ placeholder }) => {
  const { searchQuery, setSearchQuery } = useContext(context);

  return <TextInput value={searchQuery} onChange={setSearchQuery} type="search" placeholder={placeholder}/>;
};
