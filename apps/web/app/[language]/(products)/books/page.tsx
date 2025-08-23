import { Notice } from '@brickninja-org/ui/components/notice/Notice';

import { cache } from '@/lib/cache';
import { localizedName } from '@/lib/localized-name';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import { Translate } from '@/components/i18n/Translate';
import { Description } from '@/components/layout/Description';
import { ColumnSelect } from '@/components/table/ColumnSelect';
import { createSearchIndex, TableFilterButton, TableFilterProvider, TableSearchInput } from '@/components/table/TableFilter';
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
  () => db.productCategory.findMany({
    where: { products: { some: { type: 'Book' }}},
  }),
  ['catalog-book-categories'],
  { revalidate: 60 },
);

export default async function BooksPage() {
  const language = await getLanguage();
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
          <Translate id="products.books.description"/>
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

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('products.books'),
    description: t('products.books.description'),
  };
});
