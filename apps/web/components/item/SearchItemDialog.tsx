'use client';

import type { FC } from 'react';
import type { Item } from '@brickninja-org/database';
import type { LocalizedEntity } from '@/lib/localized-name';
import type { ApiItemSearchResponse } from 'app/[language]/api/item/search/route';

import { useState } from 'react';

import { Dialog } from '@brickninja-org/ui/components/dialog/Dialog';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { useDebounce } from '@/hooks/use-debounce';
import { useJsonFetch } from '@/hooks/use-fetch';
import { getLinkProperties } from '@/lib/link-properties';
import { ItemLink } from '@/components/item/ItemLink';
import { SkeletonTable } from '@/components/skeleton/SkeletonTable';

export type SearchItemDialogSubmitHandler = (item?: Pick<Item, 'id' | keyof LocalizedEntity>) => void;

export interface SearchItemDialogProps {
  open: boolean,
  onSubmitAction: SearchItemDialogSubmitHandler,
}

export const SearchItemDialog: FC<SearchItemDialogProps> = ({ open, onSubmitAction }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedValue = useDebounce(searchValue, 1000);
  const search = useJsonFetch<ApiItemSearchResponse>(`/api/item/search?q=${encodeURIComponent(debouncedValue)}`);

  return (
    <Dialog onClose={() => onSubmitAction(undefined)} title="Search Item" open={open} initialFocus={1}>
      <div className="flex flex-col mb-4">
        <TextInput placeholder="Name | ID" value={searchValue} onChange={setSearchValue}/>
      </div>

      {search.loading ? (
        <SkeletonTable columns={['Item', 'Select']} rows={2}/>
      ) : search.data.items.length === 0 ? (
        <p>No items found</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Item</Table.HeaderCell>
              <Table.HeaderCell small>Select</Table.HeaderCell>
            </tr>
          </thead>
          <tbody>
            {search.data.items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td><ItemLink item={item}/></td>
                <td><Button onClick={() => onSubmitAction(getLinkProperties(item))}>Select</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Dialog>
  );
};
