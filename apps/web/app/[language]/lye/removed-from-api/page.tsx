import { CopyButton } from '@brickninja-org/ui/components/form/buttons/CopyButton';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';

import { linkProperties } from '@/lib/link-properties';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/format/FormatDate';
import { FormatNumber } from '@/components/format/FormatNumber';
import { Translate } from '@/components/i18n/Translate';
import { ItemLink } from '@/components/item/ItemLink';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProductLink } from '@/components/product/ProductLink';

const after = new Date('2023-01-01T00:00:00Z');
// const afterArchievements = new Date('2024-03-28T00:00:00Z');

export default async function LyeRemovedFromApiPage() {
  const [removedItems, items, products, colors] = await Promise.all([
    db.item.count({ where: { removedFromApi: true }}),
    db.item.findMany({
      where: { removedFromApi: true, createdAt: { gte: after }},
      orderBy: { createdAt: 'desc' },
      select: {
        ...linkProperties,
        createdAt: true,
        current_en: { select: { createdAt: true }},
      },
    }),
    db.product.findMany({
      where: { removedFromApi: true, createdAt: { gte: after }},
      orderBy: { createdAt: 'desc' },
      select: {
        ...linkProperties,
        createdAt: true,
        current_en: { select: { createdAt: true }},
      },
    }),
    db.color.findMany({
      where: { removedFromApi: true, createdAt: { gte: after }},
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name_de: true,
        name_en: true,
        name_es: true,
        name_fr: true,
        name_nl: true,
        createdAt: true,
        current_en: { select: { createdAt: true }},
      },
    }),
  ]);

  const Items = createDataTable(items, (item) => item.id);
  const Products = createDataTable(products, (product) => product.id);
  const Colors = createDataTable(colors, (color) => color.id);

  return (
    <PageLayout>
      <p>This page shows items, products that were added to the API recently but disappeared again. There are way more items (currently <FormatNumber value={removedItems}/>) missing that were added earlier (mostly caused by the whitelist wipe in 2024).</p>

      <Headline id="items" actions={(
        <>
          <CopyButton icon="copy" copy={items.map((item) => item.id).join(',')}>Copy IDs</CopyButton>
        </>
      )}
      >
        Removed items ({items.length})
      </Headline>
      <p>These items added to the API after <FormatDate date={after}/> are currently not available.</p>
      <Items.Table>
        <Items.Column id="id" title={<Translate id="itemTable.column.id"/>} fixed small align="end" sortBy="id">{({ id }) => id}</Items.Column>
        <Items.Column id="item" title={<Translate id="itemTable.column.item"/>} fixed>{(item) => <ItemLink item={item}/>}</Items.Column>
        <Items.Column id="createdAt" title="Added at" fixed small sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Items.Column>
        <Items.Column id="removedAt" title="Removed at" fixed small sortBy={({ current_en }) => current_en.createdAt}>{({ current_en }) => <FormatDate date={current_en.createdAt}/>}</Items.Column>
      </Items.Table>

      <Headline id="products" actions={(
        <>
          <CopyButton icon="copy" copy={products.map((product) => product.id).join(',')}>Copy IDs</CopyButton>
        </>
      )}
      >
        Removed products ({products.length})
      </Headline>
      <p>These products added to the API after <FormatDate date={after}/> are currently not available.</p>
      <Products.Table>
        <Products.Column id="id" title={<Translate id="itemTable.column.id"/>} fixed small align="end" sortBy="id">{({ id }) => id}</Products.Column>
        <Products.Column id="product" title={<Translate id="itemTable.column.item"/>} fixed>{(product) => <ProductLink product={product}/>}</Products.Column>
        <Products.Column id="createdAt" title="Added at" fixed small sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Products.Column>
        <Products.Column id="removedAt" title="Removed at" fixed small sortBy={({ current_en }) => current_en.createdAt}>{({ current_en }) => <FormatDate date={current_en.createdAt}/>}</Products.Column>
      </Products.Table>

      <Headline id="colors" actions={(
        <>
          <CopyButton icon="copy" copy={colors.map((color) => color.id).join(',')}>Copy IDs</CopyButton>
        </>
      )}
      >
        Removed colors ({colors.length})
      </Headline>
      <p>These colors added to the API after <FormatDate date={after}/> are currently not available.</p>
      <Colors.Table>
        <Colors.Column id="id" title={<Translate id="itemTable.column.id"/>} fixed small align="end" sortBy="id">{({ id }) => id}</Colors.Column>
        <Colors.Column id="color" title={<Translate id="itemTable.column.item"/>} fixed>{(color) => <ItemLink item={color}/>}</Colors.Column>
        <Colors.Column id="createdAt" title="Added at" fixed small sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Colors.Column>
        <Colors.Column id="removedAt" title="Removed at" fixed small sortBy={({ current_en }) => current_en.createdAt}>{({ current_en }) => <FormatDate date={current_en.createdAt}/>}</Colors.Column>
      </Colors.Table>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Removed From API',
  robots: { index: false },
});
