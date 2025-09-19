import type { Metadata } from 'next';
import type { ItemTableQuery } from '@/components/item-table/types';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { ItemTable } from '@/components/item-table/ItemTable';
import { ItemTableContext } from '@/components/item-table/ItemTable.context';
import { ItemTableColumnsButton } from '@/components/item-table/ItemTableColumnsButton';
import { PageLayout } from '@/components/layout/PageLayout';

const query: ItemTableQuery = {
  where: { type: 'Container', contains: { none: {}}},
};

export default function ItemEmptyContainersPage() {
  return (
    <PageLayout>
      <ItemTableContext id="empty-containers">
        <Headline id="empty" actions={<ItemTableColumnsButton/>}>Empty Containers</Headline>
        <p>This page shows all container items that don&apos;t have any contents. You can help by adding the content on the item page.</p>

        <ItemTable query={query}/>
      </ItemTableContext>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Empty Containers',
};
