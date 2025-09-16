import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { TranslationId } from '@/lib/translate';
import type { TODO } from '@/lib/todo';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { TableOfContentAnchor } from '@brickninja-org/ui/components/table-of-content/TableOfContents';

import { localizedName } from '@/lib/localized-name';
import { pageView } from '@/lib/page-view';
import { parseIcon } from '@/lib/parse-icon';
import { getTranslate } from '@/lib/translate';
import { Json } from '@/components/format/Json';
import DetailLayout from '@/components/layout/DetailLayout';
import { getProduct, getRevision } from './data';
import { ItemTableContext } from '@/components/item-table/ItemTable.context';
import { ItemTableColumnsButton } from '@/components/item-table/ItemTableColumnsButton';
import { ItemTable } from '@/components/item-table/ItemTable';
import { ProductInfobox } from '@/components/product/ProductInfobox';
import { ProductTooltip } from '@/components/product/ProductTooltip';
import { extraColumn } from '@/components/item-table/columns';
import { EntityIconMissing } from '@/components/entity/EntityIconMissing';
import { RevisionTable } from '@/components/revision/RevisionTable';
import { ProductLink } from '@/components/product/ProductLink';
import { ItemBarcodeColumn } from './ExtraColumns';

export interface ProductPageComponentProps {
  language: Language,
  productId: number,
  revisionId?: string,
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

  return (
    <DetailLayout
      title={data.name}
      icon={icon?.id === product.icon?.id ? product.icon : (icon ? { ...icon, color: null } : <EntityIconMissing size={48}/>)}
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
            extraColumns={[extraColumn<'item'>({ id: 'barcode', select: { barcode: true }, title: t('itemTable.column.barcode'), component: ItemBarcodeColumn as TODO, order: 201, small: true })]}/>
        </ItemTableContext>
      )}

      <Headline id="history">History</Headline>
      <RevisionTable
        revisions={product.history.map(({ revision }) => revision)}
        link={
          ({ revisionId, children }) => <ProductLink product={product} language={language} revision={revisionId} icon="none">{children}</ProductLink>
        }/>

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
};
