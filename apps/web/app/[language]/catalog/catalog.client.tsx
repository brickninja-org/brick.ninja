'use client';

import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from 'react';

import type { DataTableRowFilterComponent, DataTableRowFilterComponentProps } from '@brickninja-org/ui/components/table/data-table';
import { cn } from '@brickninja-org/ui/lib';
import { Dropdown } from '@brickninja-org/ui/components/dropdown';
import { Button } from '@brickninja-org/ui/components/form/button';
import { Checkbox } from '@brickninja-org/ui/components/form/checkbox';
import { FlexRow } from '@brickninja-org/ui/components/flex-row';
import { MenuList } from '@brickninja-org/ui/components/layout/menu-list';
import { Separator } from '@brickninja-org/ui/components/layout/separator';

interface SetsTableContext {
  filteredRows?: number[] | undefined;
  categoryMap: Map<number, { name: string, itemIndexes: number[] }>;
  categoryIds: number[];
  setCategoryIds: (categoryIds: number[]) => void;
}

const context = createContext<SetsTableContext>({ filteredRows: undefined, categoryMap: new Map(), categoryIds: [], setCategoryIds: () => {} });

export interface SetsTableProviderProps {
  categories: { id: number, name: string, itemIndexes: number[] }[];
  children: ReactNode;
}

export const SetsTableProvider: FC<SetsTableProviderProps> = ({ categories, children }) => {
  const categoryMap = new Map(categories.map(({ id, ...category }) => [id, category]));
  const allCategoryIds = categories.map(({ id }) => id);

  const [categoryIds, setCategoryIds] = useState<number[]>(allCategoryIds);

  const filteredRows = categoryIds.length !== allCategoryIds.length
    ? categoryIds.flatMap((id) => categoryMap.get(id)?.itemIndexes ?? [])
    : undefined;

  return (
    <context.Provider value={{ filteredRows, categoryIds, setCategoryIds, categoryMap }}>
      {children}
    </context.Provider>
  );
};

export const SetsRowFilter: DataTableRowFilterComponent = ({ children, index }: DataTableRowFilterComponentProps) => {
  const { filteredRows } = useContext(context);
  const isVisible = filteredRows === undefined || filteredRows.includes(index);

  return <tr hidden={!isVisible}>{children}</tr>;
};

export interface SetsTableFilterProps {
  totalCount: number;
}

export const SetsTableFilter: FC<SetsTableFilterProps> = ({ totalCount: count }) => {
  const { categoryIds, setCategoryIds, categoryMap } = useContext(context);

  const [isShiftPressed, setIsShiftPressed] = useState(false);

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

  return (
    <Dropdown button={<Button icon={categoryMap.size === categoryIds.length ? 'filter' : 'filter-active'}>Filter</Button>} preferredPlacement="bottom">
      <MenuList>
        <Checkbox checked={categoryIds.length > 0} indeterminate={categoryIds.length < categoryMap.size && categoryIds.length > 0} onChange={() => setCategoryIds(categoryIds.length > 0 ? [] : Array.from(categoryMap.keys()))}>
          <FlexRow align="between">
            All
            <span className="pl-2">{count}</span>
          </FlexRow>
        </Checkbox>
        <Separator/>
        {Array.from(categoryMap.entries()).map(([categoryId, category]) => (
          <Checkbox key={categoryId} checked={categoryIds.includes(categoryId)} onChange={() => isShiftPressed ? setCategoryIds(toggleArray(categoryIds, categoryId)) : setCategoryIds([categoryId])}>
            <FlexRow align="between">
              {category.name}
              <span className={cn(['pl-2', category.itemIndexes.length === 0 ? 'text-gray-600' : undefined])}>{category.itemIndexes.length ?? 0}</span>
            </FlexRow>
          </Checkbox>
        ))}
        <span className="py-2 px-4 text-gray-600">Tip: Hold <kbd className="py-[1px] px-[3px] border border-gray-300 rounded-sm">Shift</kbd> to select a single category</span>
      </MenuList>
    </Dropdown>
  );
};

function toggleArray<T>(array: T[], value: T): T[] {
  const withoutValue = array.filter((v) => v !== value);
  return withoutValue.length === array.length ? [...array, value] : withoutValue;
}
