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
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { CatalogProductDataTable, createProductTable } from '../Table';

const getGear = cache(
  () => db.product.findMany({
    where: { OR: [{ type: 'Gear' }] },
    include: {
      icon: true,
      categories: true,
    },
    orderBy: { id: 'asc' },
  }),
  ['catalog-gear'],
  { revalidate: 60 },
);

const getProductCategories = cache(
  () => db.category.findMany({
    where: { products: { some: { type: 'Gear' }}},
  }),
  ['catalog-gear-categories'],
  { revalidate: 60 },
);

export default async function GearPage({ params }: PageProps) {
  const { language } = await params;
  const [gear, productCategories] = await Promise.all([
    getGear(),
    getProductCategories(),
  ]);

  const Products = createProductTable(gear);

  const productFilter = productCategories.map((category) => ({
    id: category.id,
    name: localizedName(category, language),
    rowIndexes: gear.map(({ categoryIds }, index) => [categoryIds, index] as const)
      .filter(([categoryIds]) => categoryIds.includes(category.id))
      .map(([, index]) => index),
  })).sort((a, b) => a.name.localeCompare(b.name));

  const productSearchIndex = createSearchIndex(gear, (product) => product[`name_${language}`]);

  return (
    <>
      <TableFilterProvider filter={productFilter} searchIndex={productSearchIndex}>
        <Notice icon="eye" index={false}>This is a preview page and more features will be added in the future.</Notice>
        <Description
          actions={[
            <TableSearchInput key="search"/>,
            <TableFilterButton key="filter" totalCount={gear.length}/>,
            <ColumnSelect key="columns" table={Products}/>,
          ]}
        >
          <Translate id="catalog.gear.description"/>
        </Description>
        <CatalogProductDataTable language={language} table={Products} filtered/>
      </TableFilterProvider>
    </>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: translate('catalog.gear', language),
    description: translate('catalog.gear.description', language),
    alternates: getAlternateUrls('/catalog/gear', language),
  };
}
