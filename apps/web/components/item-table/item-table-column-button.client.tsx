'use client';

import type { FC } from 'react';
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
    <Dropdown button={<Button icon="columns">{translations['table.columns']}</Button>} preferredPlacement="right-start">
      <MenuList>
        {!user && (
          <div style={{ display: 'flex', gap: 12, padding: '4px 16px', maxWidth: 200, alignItems: 'center', background: 'var(--color-background-light)', border: '1px solid var(--color-border-dark)', lineHeight: 1.5, marginBottom: 8, borderRadius: 2 }}>
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
