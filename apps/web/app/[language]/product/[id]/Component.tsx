import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { TranslationId } from '@/lib/translate';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Icon } from '@brickninja-org/ui/icons';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { table, Table } from '@brickninja-org/ui/components/table/Table';
import { TableOfContentAnchor } from '@brickninja-org/ui/components/table-of-content/TableOfContents';
import { Tip } from '@brickninja-org/ui/components/tip/Tip';

import { getLinkProperties } from '@/lib/link-properties';
import { localizedName } from '@/lib/localized-name';
import { pageView } from '@/lib/page-view';
import { parseIcon } from '@/lib/parse-icon';
import { getTranslate } from '@/lib/translate';
import { FormatDate } from '@/components/format/FormatDate';
import { Json } from '@/components/format/Json';
import DetailLayout from '@/components/layout/DetailLayout';
import { Tooltip } from '@/components/tooltip/Tooltip';
import { getProduct, getRevision } from './data';
import { ItemTableContext } from '@/components/item-table/ItemTable.context';
import { ItemTableColumnsButton } from '@/components/item-table/ItemTableColumnsButton';
import { ItemTable } from '@/components/item-table/ItemTable';
import { ProductInfobox } from '@/components/product/ProductInfobox';
import { ProductLinkTooltip } from '@/components/product/ProductLinkTooltip';
import { ProductTooltip } from '@/components/product/ProductTooltip';
import { extraColumn } from '@/components/item-table/columns';
import type { TODO } from '@/lib/todo';
import { ItemBarcodeColumn } from './ExtraColumns';

export interface ProductPageComponentProps {
  language: Language;
  productId: number;
  revisionId?: string;
}

export const ProductPageComponent: FC<ProductPageComponentProps> = async ({ language, productId, revisionId }) => {
  const fixedRevision = revisionId !== undefined;

  const [product, { revision, data }] = await Promise.all([
    getProduct(productId, language),
    getRevision(productId, language, revisionId),
    pageView('product', productId),
  ]);

  if (!product || !revision || !data) {
    notFound();
  }

  const t = getTranslate(language);

  const breadcrumb = [
    t(`item.type.${product.type}` as TranslationId),
    localizedName(product.categories[0], language),
  ].filter(Boolean).join(' › ');

  const hasItems = product._count.items > 0;

  const icon = parseIcon(data.icon);

  const styles = table();

  return (
    <DetailLayout
      title={data.name}
      icon={icon?.id === product.icon?.id ? product.icon : (icon ? { ...icon, color: null } : null)}
      iconType="product"
      breadcrumb={breadcrumb}
      infobox={<ProductInfobox product={product} data={data} language={language}/>}
    >
      {product[`currentId_${language}`] !== revision.id && (
        <Notice icon="revision">You are viewing an old revision of this product. <Link href={`/product/${product.id}`}>View Current</Link>.</Notice>
      )}
      {product[`currentId_${language}`] === revision.id && fixedRevision && (
        <Notice icon="revision">You are viewing this product at a fixed revision. <Link href={`/product/${product.id}`}>View current.</Link></Notice>
      )}

      <TableOfContentAnchor id="tooltip">Tooltip</TableOfContentAnchor>
      <ProductTooltip product={data} language={language} hideTitle/>

      {hasItems && (
        <ItemTableContext id="productItems">
          <Headline id="items" actions={<ItemTableColumnsButton/>}>Items</Headline>
          <ItemTable
            query={{ where: { products: { some: { id: productId }}}}} collapsed defaultColumns={['item', 'type', 'barcode']}
            extraColumns={[extraColumn<'item'>({ id: 'barcode', select: { barcode: true }, title: t('itemTable.column.barcode'), component: ItemBarcodeColumn as TODO, order: 71, small: true })]}/>
        </ItemTableContext>
      )}

      <Headline id="history">History</Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small/>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell small>Date</Table.HeaderCell>
            <Table.HeaderCell small>Actions</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {product.history.map((history) => (
            <tr key={history.revisionId} className={styles.tr()}>
              <td className="pr-0">{history.revisionId === revision.id && <Tip tip="Currently viewing"><Icon icon="eye"/></Tip>}</td>
              <td className={styles.td()}>
                <Tooltip content={<ProductLinkTooltip product={getLinkProperties(product)} language={language} revision={history.revisionId}/>}>
                  <Link href={`/product/${product.id}/${history.revisionId}`}>
                    {history.revision.description}
                  </Link>
                </Tooltip>
              </td>
              <td className={styles.td()}><FormatDate date={history.revision.createdAt} relative/></td>
              <td className={styles.td()}>
                {history.revisionId !== revision.id && (
                  <FlexRow>
                    <Link href={`/product/${product.id}/${history.revisionId}`}>View</Link>
                    <Link href={`/product/diff/${history.revisionId}/${revision.id}`}>Compare</Link>
                  </FlexRow>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
};
