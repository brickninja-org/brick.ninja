import type { Metadata } from 'next';
import type { PageProps } from '@/lib/next';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { Translate } from '@/components/i18n/Translate';
import { localizedName } from '@/lib/localized-name';
import { createSearchIndex, TableFilterButton, TableFilterProvider, TableSearchInput } from '@/components/table/TableFilter';
import { Description } from '@/components/layout/Description';
import { ColumnSelect } from '@/components/table/ColumnSelect';
import { translate } from '@/lib/translate';
import { getAlternateUrls } from '@/lib/url';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { CatalogProductDataTable, createProductTable } from '../Table';

const getBooks = cache(
  () => db.product.findMany({
    where: { OR: [{ type: { in: ['Book'] }}] },
    include: {
      icon: true,
      categories: true,
    },
    orderBy: { id: 'asc' },
  }),
  ['catalog-books'],
  { revalidate: 60 },
);

const getProductCategories = cache(
  () => db.category.findMany({
    where: { products: { some: { type: 'Book' }}},
  }),
  ['catalog-book-categories'],
  { revalidate: 60 },
);

export default async function ProductPage({ params }: PageProps) {
  const { language } = await params;
  const [books, productCategories] = await Promise.all([
    getBooks(),
    getProductCategories(),
  ]);

  const Products = createProductTable(books);

  const productFilter = productCategories.map((category) => ({
    id: category.id,
    name: localizedName(category, language),
    rowIndexes: books.map(({ categoryIds }, index) => [categoryIds, index] as const)
      .filter(([categoryIds]) => categoryIds.includes(category.id))
      .map(([, index]) => index),
  })).sort((a, b) => a.name.localeCompare(b.name));

  const productSearchIndex = createSearchIndex(books, (product) => strip(product[`name_${language}`]));

  return (
    <>
      <TableFilterProvider filter={productFilter} searchIndex={productSearchIndex}>
        <Notice icon="eye" index={false}>This is a preview page and more features will be added in the future.</Notice>
        <Description
          actions={[
            <TableSearchInput key="search"/>,
            <TableFilterButton key="filter" totalCount={books.length}/>,
            <ColumnSelect key="columns" table={Products}/>,
          ]}
        >
          <Translate id="catalog.books.description"/>
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
    title: translate('catalog.books', language),
    description: translate('catalog.books.description', language),
    alternates: getAlternateUrls('/catalog/books', language),
  };
}
