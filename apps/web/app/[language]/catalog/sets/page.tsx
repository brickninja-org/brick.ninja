import { createDataTable } from '@brickninja-org/ui/components/table/data-table';

import { cache } from '@/lib/cache';
import { localizedName } from '@/lib/localized-name';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { BricklinkAccounts } from '@/components/bn2me/bricklink-accounts';
import { FormatNumber } from '@/components/format/format-number';
import { Translate } from '@/components/i18n/translate';
import { ItemLink } from '@/components/item/item-link';
import { Description } from '@/components/layout/description';
import { ColumnSelect } from '@/components/table/column-select';
import { CategoryRowFilter, CategoryTableFilter, CategoryTableProvider } from '../catalog.client';
import type { Metadata } from 'next';
import { translate } from '@/lib/translate';
import { getAlternateUrls } from '@/lib/url';

const getSets = cache(
  () => db.item.findMany({
    where: { type: 'Set', year: { gte: new Date().getFullYear() }, released: true },
    include: { categories: true },
    orderBy: { productCode: 'asc' },
    // take: 500,
  }),
  ['catalog-sets'], { revalidate: 60 },
);

const getSetsCategories = cache(
  () => db.itemCategory.findMany(),
  ['catalog-sets-categories'], { revalidate: 60 },
);

export default async function CatalogSetsPage({ params }: PageProps) {
  const { language } = await params;

  const [items, categories] = await Promise.all([
    getSets(),
    getSetsCategories(),
  ]);

  const Sets = createDataTable(items, ({ id }) => id);

  const setsFiltering = categories.map((category) => ({
    id: category.id,
    name: localizedName(category, language),
    itemIndexes: items.map(({ categoryIds }, index) => [categoryIds, index] as const)
      .filter(([categoryIds]) => categoryIds.includes(category.id))
      .map(([, index]) => index),
  }));

  return (
    <>
      <CategoryTableProvider categories={setsFiltering}>
        <BricklinkAccounts authorizationMessage="Authorize brick.ninja to view your collections." loading={null}/>

        <Description actions={[<CategoryTableFilter key="filter" totalCount={items.length}/>, <ColumnSelect key="columns" table={Sets}/>]}>
          <Translate id="catalog.sets.description"/>
        </Description>
        
        <Sets.Table rowFilter={CategoryRowFilter}>
          <Sets.Column id="id" title={<Translate id="itemTable.column.id"/>} align="right" small hidden>{({ id }) => id}</Sets.Column>
          <Sets.Column id="productCode" title={<Translate id="itemTable.column.productCode"/>} align="right" small sortBy={({ productCode }) => productCode}>{({ productCode }) => productCode}</Sets.Column>
          <Sets.Column id="name" title={<Translate id="itemTable.column.item"/>} align="left">{(item) => <ItemLink item={item}/> }</Sets.Column>
          <Sets.Column id="minifigureCount" title={<Translate id="itemTable.column.minifigureCount"/>} align="right" sortBy="minifigureCount" small>{({ minifigureCount }) => <FormatNumber value={minifigureCount}/>}</Sets.Column>
          <Sets.Column id="pieceCount" title={<Translate id="itemTable.column.pieceCount"/>} align="right" sortBy="pieceCount" small>{({ pieceCount }) => <FormatNumber value={pieceCount}/>}</Sets.Column>
          <Sets.Column id="minAge" title={<Translate id="itemTable.column.minAge"/>} align="right" sortBy="pieceCount" small hidden>{({ minAge }) => <><FormatNumber value={minAge}/>+</>}</Sets.Column>
        </Sets.Table>
      </CategoryTableProvider>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: await translate('catalog.sets', language),
    description: await translate('catalog.sets.description', language),
    alternates: getAlternateUrls('/catalog/sets', language),
  };
}
