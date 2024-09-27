import type { Metadata } from 'next';

import { createDataTable } from '@brickninja-org/ui/components/table/data-table';

import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { translate } from '@/lib/translate';
import { getAlternateUrls } from '@/lib/url';
import { Translate } from '@/components/i18n/translate';
import { Description } from '@/components/layout/description';
import { ColumnSelect } from '@/components/table/column-select';
import { unstable_cache } from 'next/cache';
import type { Language } from '@brickninja-org/database';
import { localizedName } from '@/lib/localized-name';

const getItems = unstable_cache((language: Language) => {
  return db.item.findMany({
    where: { type: 'Book' },
    select: {
      id: true,
      name_en: language === 'en',
      name_nl: language === 'nl',
      productCode: true,
    },
    orderBy: { productCode: 'asc' },
  });
}, ['get-books']);

export default async function CatalogBookPage({ params }: PageProps) {
  // get item ids
  const items = await getItems(params.language);

  const Books = createDataTable(items, ({ id }) => id);

  return (
    <>
      <p>Login</p>
      <Description actions={<ColumnSelect table={Books}/>}>
        <Translate id="catalog.books.description"/>
      </Description>

      <Books.Table>
        <Books.Column id="id" title="ID" align="right" small hidden>{({ id }) => id}</Books.Column> 
        <Books.Column id="productCode" title="Product Code" align="right" sortBy="productCode">{({ productCode }) => productCode}</Books.Column>
        <Books.Column id="name" title="Name" align="left">{(item) => localizedName(item, params.language) }</Books.Column>
      </Books.Table>
    </>
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  return {
    title: translate('catalog.books', params.language),
    description: translate('catalog.books.description', params.language),
    alternates: getAlternateUrls('/catalog/books'),
  };
}
