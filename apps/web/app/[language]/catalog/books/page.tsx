import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

import type { Language } from '@brickninja-org/database';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';

import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { translate } from '@/lib/translate';
import { getAlternateUrls } from '@/lib/url';
import { BricklinkAccounts } from '@/components/bn2me/bricklink-accounts';
import { FormatNumber } from '@/components/format/format-number';
import { Translate } from '@/components/i18n/translate';
import { Description } from '@/components/layout/description';
import { ColumnSelect } from '@/components/table/column-select';
import { ItemLink } from '@/components/item/item-link';

const getItems = unstable_cache((language: Language) => {
  return db.item.findMany({
    where: { type: 'Book' },
    select: {
      id: true,
      name_en: language === 'en',
      name_nl: language === 'nl',
      minifigureCount: true,
      pieceCount: true,
    },
    orderBy: { id: 'desc' },
  });
}, ['get-books']);

export default async function CatalogBookPage({ params }: PageProps) {
  const { language } = await params;

  // get item ids
  const items = await getItems(language);

  const Books = createDataTable(items, ({ id }) => id);

  return (
    <>
      <BricklinkAccounts authorizationMessage="Authorize brick.ninja to view your collections." loading={null}/>

      <Description actions={<ColumnSelect table={Books}/>}>
        <Translate id="catalog.books.description"/>
      </Description>

      <Books.Table>
        <Books.Column id="id" title={<Translate id="itemTable.column.id"/>} align="end" small hidden>{({ id }) => id}</Books.Column> 
        <Books.Column id="name" title={<Translate id="itemTable.column.item"/>} align="end">{(item) => <ItemLink item={item}/> }</Books.Column>
        <Books.Column id="minifigureCount" title={<Translate id="itemTable.column.minifigureCount"/>} align="end" sortBy="minifigureCount" small>{({ minifigureCount }) => <FormatNumber value={minifigureCount}/>}</Books.Column>
        <Books.Column id="pieceCount" title={<Translate id="itemTable.column.pieceCount"/>} align="end" sortBy="pieceCount" small>{({ pieceCount }) => <FormatNumber value={pieceCount}/>}</Books.Column>
      </Books.Table>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: await translate('catalog.books', language),
    description: await translate('catalog.books.description', language),
    alternates: getAlternateUrls('/catalog/books', language),
  };
}
