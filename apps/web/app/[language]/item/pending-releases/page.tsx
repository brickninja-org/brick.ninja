import { Headline } from '@brickninja-org/ui/components/headline';

import { ItemTable, ItemTableColumnsButton, ItemTableContext } from '@/components/item-table';
import type { ItemTableQuery } from '@/components/item-table/types';
import { PageLayout } from '@/components/layout/page-layout';
import type { Metadata } from 'next';

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
