import type { PageProps } from '@/lib/next';

import { Notice } from '@brickninja-org/ui/components/notice/Notice';

import { cache } from '@/lib/cache';
import { localizedName } from '@/lib/localized-name';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { getTranslate } from '@/lib/translate';
import { Translate } from '@/components/i18n/Translate';
import { Description } from '@/components/layout/Description';
import { ColumnSelect } from '@/components/table/ColumnSelect';
import { createSearchIndex, TableFilterButton, TableFilterProvider, TableSearchInput } from '@/components/table/TableFilter';
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

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('catalog.gear'),
    description: t('catalog.gear.description'),
  };
});
