'use client';

import { Suspense, type FC } from 'react';
import type { TranslationSubset } from '@/lib/translate';

import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { Checkbox } from '@brickninja-org/ui/components/form/Checkbox';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
import { Separator } from '@brickninja-org/ui/components/layout/Separator';
import { Skeleton } from '@/components/skeleton/Skeleton';
import { Icon } from '@brickninja-org/ui/icons';

import { useUser } from '@/components/user/use-user';

import { useItemTableContext } from './context';

export interface ItemTableColumnsButtonProps {
  translations: TranslationSubset<'table.columns' | 'table.columns.reset'>
}

export const ItemTableColumnsButton: FC<ItemTableColumnsButtonProps> = ({ translations }) => {
  const { availableColumns, selectedColumns, defaultColumns, setSelectedColumns } = useItemTableContext();
  const columns = selectedColumns ?? defaultColumns;

  const values = Object.values(availableColumns);

  return (
    <Dropdown button={<Button icon={<Icon icon="table-insert-column"/>}>{translations['table.columns']}</Button>} preferredPlacement="right-start">
      <MenuList>
        <Suspense fallback={<Skeleton/>}>
          <ItemTableColumnsButtonCookieNotice/>
        </Suspense>
        {values.map((column) => (
          <Checkbox key={column.id} checked={columns.includes(column.id)} onChange={(checked) => setSelectedColumns(values.filter(({ id }) => id !== column.id ? columns.includes(id) : checked).map(({ id }) => id))}>{column.title}</Checkbox>
        ))}
        <Separator/>
        <Button appearance="menu" onClick={() => setSelectedColumns(undefined)} disabled={selectedColumns === undefined}>{translations['table.columns.reset']}</Button>
      </MenuList>
    </Dropdown>
  );
};

export const ItemTableColumnsButtonCookieNotice = () => {
  const user = useUser();

  return !user && (
    <div className="flex gap-3 items-center py-1 px-4 max-w-[264px] min-w-full mb-2 bg-gray-100 rounded-xs border border-gray-300 leading-normal">
      <Icon icon="cookie"/>
      Changing columns will store cookies in your browser.
    </div>
  );
};
