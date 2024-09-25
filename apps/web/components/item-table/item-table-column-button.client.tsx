'use client';

import type { FC } from 'react';
import { BiColumns } from 'react-icons/bi';
import { PiCookieLight } from 'react-icons/pi';

import { Dropdown } from '@brickninja-org/ui/components/dropdown';
import { Button } from '@brickninja-org/ui/components/form/button';
import { Checkbox } from '@brickninja-org/ui/components/form/checkbox';
import { MenuList } from '@brickninja-org/ui/components/layout/menu-list';
import { Separator } from '@brickninja-org/ui/components/layout/separator';

import type { TranslationSubset } from '@/lib/translate';
import { useUser } from '@/components/user/use-user';

import { useItemTableContext } from './context';

export interface ItemTableColumnsButtonProps {
  translations: TranslationSubset<'table.columns' | 'table.columns.reset'>
}

export const ItemTableColumnsButton: FC<ItemTableColumnsButtonProps> = ({ translations }) => {
  const { user } = useUser();
  const { availableColumns, selectedColumns, defaultColumns, setSelectedColumns } = useItemTableContext();
  const columns = selectedColumns ?? defaultColumns;

  const values = Object.values(availableColumns);

  return (
    <Dropdown button={<BiColumns size={20}>{translations['table.columns']}</BiColumns>} preferredPlacement="right-start">
      <MenuList>
        {!user && (
          <div className="flex items-center gap-3 mb-2 py-1 px-4 max-w-[200px] rounded-sm border bg-gray-200">
            <PiCookieLight size={20}/>
            Changing columns will store cookies in your browser
          </div>
        )}
        {values.map((column) => (
          <Checkbox key={column.id} checked={columns.includes(column.id)} onChange={(checked) => setSelectedColumns(values.filter(({ id }) => id !== column.id ? columns.includes(id) : checked).map(({ id }) => id))}>{column.title}</Checkbox>
        ))}
        <Separator/>
        <Button appearance="menu" onClick={() => setSelectedColumns(undefined)} disabled={selectedColumns === undefined}>{translations['table.columns.reset']}</Button>
      </MenuList>
    </Dropdown>
  );
};
