import type { Metadata } from 'next';
import type { ItemTableQuery } from '@/components/item-table/types';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { ItemTable } from '@/components/item-table/ItemTable';
import { ItemTableContext } from '@/components/item-table/ItemTable.context';
import { ItemTableColumnsButton } from '@/components/item-table/ItemTableColumnsButton';
import { PageLayout } from '@/components/layout/PageLayout';

const query: ItemTableQuery = {
  where: { released: false },
};

export default function PendingReleasesPage() {
  return (
    <PageLayout>
      <ItemTableContext id="pending-releases">
        <Headline id="pending-releases" actions={<ItemTableColumnsButton/>}>Pending Releases</Headline>
        <p>This page shows all pending releases.</p>

        <ItemTable query={query}/>
      </ItemTableContext>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Pending Releases',
};
