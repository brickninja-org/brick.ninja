import type { Metadata } from 'next';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { Translate } from '@/components/i18n/Translate';
import { localizedName } from '@/lib/localized-name';
import type { PageProps } from '@/lib/next';
import { createSearchIndex, TableFilterButton, TableFilterProvider, TableSearchInput } from '@/components/table/TableFilter';
import { Description } from '@/components/layout/Description';
import { ColumnSelect } from '@/components/table/ColumnSelect';
import { translate } from '@/lib/translate';
import { getAlternateUrls } from '@/lib/url';
import { Notice } from '@/components/notice/Notice';
import { CatalogProductDataTable, createProductTable } from '../Table';

const getSets = cache(
  () => db.product.findMany({
    where: { OR: [{ type: { in: ['Set'] }}] },
    include: {
      icon: true,
      categories: true,
    },
    orderBy: { id: 'asc' },
  }),
  ['catalog-sets'],
  { revalidate: 60 },
);

const getProductCategories = cache(
  () => db.category.findMany({
    where: { products: { some: { type: 'Set' }}},
  }),
  ['catalog-set-categories'],
  { revalidate: 60 },
);

export default async function ProductPage({ params }: PageProps) {
  const { language } = await params;
  const [sets, productCategories] = await Promise.all([
    getSets(),
    getProductCategories(),
  ]);

  const Products = createProductTable(sets);

  const productFilter = productCategories.map((category) => ({
    id: category.id,
    name: localizedName(category, language),
    rowIndexes: sets.map(({ categoryIds }, index) => [categoryIds, index] as const)
      .filter(([categoryIds]) => categoryIds.includes(category.id))
      .map(([, index]) => index),
  })).sort((a, b) => a.name.localeCompare(b.name));

  const productSearchIndex = createSearchIndex(sets, (product) => strip(product[`name_${language}`]));

  return (
    <>
      <TableFilterProvider filter={productFilter} searchIndex={productSearchIndex}>
        <Notice color="primary" radius="sm" className="mb-4">This is a preview page and more features will be added in the future.</Notice>
        <Description
          actions={[
            <TableSearchInput key="search"/>,
            <TableFilterButton key="filter" totalCount={sets.length}/>,
            <ColumnSelect key="columns" table={Products}/>,
          ]}
        >
          <Translate id="catalog.products.description"/>
        </Description>
        <CatalogProductDataTable language={language} table={Products} filtered/>
      </TableFilterProvider>
    </>
  );
}

function strip(text: string | undefined | null) {
  return 'string' !== typeof text ? '' : text
    .replace(/<c=#([^>]+)>([^]*?)(<\/?c>|$)/g, '$2')
    .replace(/<c[=@][@=]?([^>]+)>([^]*?)(<\/?c\/?(=@?[^>]+)?>|$)/g, '$2')
    .replace(/<br\/?>/g, '\n');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: translate('catalog.sets', language),
    description: translate('catalog.sets.description', language),
    alternates: getAlternateUrls('/catalog/sets', language),
  };
}
