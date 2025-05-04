import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { TranslationId } from '@/lib/translate';
import type { TODO } from '@/lib/todo';

import { Suspense } from 'react';

import NextLink from 'next/link';
import { notFound } from 'next/navigation';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { Table } from '@brickninja-org/ui/components/table/Table';
import { TableOfContentAnchor } from '@brickninja-org/ui/components/table-of-content/TableOfContents';
import { Tip } from '@brickninja-org/ui/components/tip/Tip';
import { Icon } from '@brickninja-org/ui/icons';

import { getLinkProperties } from '@/lib/link-properties';
import { pageView } from '@/lib/page-view';
import DetailLayout from '@/components/layout/DetailLayout';
import { Breadcrumb, BreadcrumbItem } from '@/components/breadcrumb/Breadcrumb';
import { FormatDate } from '@/components/format/FormatDate';
import { ItemInfobox } from '@/components/item/ItemInfobox';
import { ItemLinkTooltip } from '@/components/item/ItemLinkTooltip';
import { ItemTooltip } from '@/components/item/ItemTooltip';
import { Json } from '@/components/format/Json';
import { Tooltip } from '@/components/tooltip/Tooltip';

import { EditContents } from './_edit-content/EditContents';
import { getItem, getRevision } from './data';
import { SimilarItems } from './SimilarItems';
import { ItemTableContext } from '@/components/item-table/ItemTable.context';
import { ItemTableColumnsButton } from '@/components/item-table/ItemTableColumnsButton';
import { ItemTable } from '@/components/item-table/ItemTable';
import { getTranslate } from '@/lib/translate';
import { extraColumn } from '@/components/item-table/columns';
import { ContentQuantityColumn } from './ExtraColumns';
import { ItemList, ItemListItem } from '@/components/item/ItemList';
import { ProductTable } from '@/components/product/ProductTable';
import { parseIcon } from '@/lib/parse-icon';
import { EntityIconMissing } from '@/components/entity/EntityIconMissing';

export interface ItemPageComponentProps {
  language: Language;
  itemId: number;
  revisionId?: string;
}

export const ItemPageComponent: FC<ItemPageComponentProps> = async ({ language, itemId, revisionId }) => {
  // validate itemId
  if (isNaN(itemId)) {
    notFound();
  }

  // load data
  const [item, { revision, data }] = await Promise.all([
    getItem(itemId, language),
    getRevision(itemId, language, revisionId),
    pageView('item', itemId),
  ]);

  // 404 if item does not exist
  if (!item || !revision || !data) {
    notFound();
  }

  const fixedRevision = revisionId !== undefined;

  const showContents = item.type === 'Container' || item._count.contains > 0;
  const canHaveContents = item.type === 'Container' || item.type === 'Set';

  const hasProducts = item.productIds.length > 0;
  const unknownProductIds = item.productIds.filter((id) => item.products.every((product) => product.id !== id));

  const totalPieces = item.contains.reduce((total, content) => {
    if (content.contentItem.type === 'Element' && content.quantity) {
      return total + content.quantity;
    }
    return total;
  }, 0);

  const icon = parseIcon(data.icon);

  const t = getTranslate(language);

  return (
    <DetailLayout
      title={data.name}
      icon={icon?.id === item.icon?.id ? item.icon : (icon ? { ...icon, color: null } : <EntityIconMissing size={48}/>)}
      className=""
      breadcrumb={(
        <Breadcrumb>
          <BreadcrumbItem name={t('navigation.items')} href="/item"/>
          <BreadcrumbItem name={t(`item.type.${data.type}`)}/>
          {data.details?.type && <BreadcrumbItem name={t(`item.type.${data.type}.${data.details.type}` as TranslationId)}/>}
        </Breadcrumb>
      )}
      infobox={<ItemInfobox item={item} data={data} language={language}/>}
      actions={[
        canHaveContents ? <EditContents key="edit-content" itemId={itemId} contents={item.contains} appearance="menu"/> : undefined,
      ]}
    >
      {item[`currentId_${language}`] !== revision.id && (
        <Notice>You are viewing an old revision of this item. Some data is only available when viewing the latest version. <NextLink href={`/item/${item.id}`}>View latest</NextLink>.</Notice>
      )}
      {item[`currentId_${language}`] === revision.id && fixedRevision && (
        <Notice>You are viewing this item at a fixed revision. Some data is only available when viewing the latest version. <NextLink href={`/item/${item.id}`}>View latest</NextLink>.</Notice>
      )}

      <TableOfContentAnchor id="tooltip">Tooltip</TableOfContentAnchor>
      <ItemTooltip item={data} language={language} hideTitle/>

      {hasProducts && (
        <>
          <ProductTable products={item.products} headline="Products" headlineId="products"/>

          {unknownProductIds.length > 0 && (
            <ItemList>
              {unknownProductIds.map((id) => <ItemListItem key={id}>Unknown product</ItemListItem>)}
            </ItemList>
          )}
        </>
      )}

      {!fixedRevision && item._count.containedIn > 0 && (
        <ItemTableContext id="containedIn">
          <Headline id="contained" actions={<ItemTableColumnsButton/>}>Contained In</Headline>
          <ItemTable query={{ model: 'content', mapToItem: 'containerItem', where: { contentItemId: item.id }}}
            extraColumns={[
              extraColumn<'content'>({ id: 'quantity', select: { quantity: true }, title: t('container.quantity'), component: ContentQuantityColumn as TODO, order: 71, align: 'end', small: true, orderBy: [{ quantity: 'desc' }, { quantity: 'asc' }] }),
            ]}
            defaultColumns={['item', 'quantity', 'type']}/>
        </ItemTableContext>
      )}

      {!fixedRevision && showContents && (
        <ItemTableContext id="contents">
          <Headline id="content" actions={[
            <EditContents key="edit" itemId={itemId} contents={item.contains}/>,
            item._count.contains > 0 && <ItemTableColumnsButton key="columns"/>,
          ]}
          >
            Contents <span className="font-sans font-normal text-base text-muted">({totalPieces} pieces)</span>
          </Headline>

          {item._count.contains > 0 && (
            <ItemTable query={{ model: 'content', mapToItem: 'contentItem', where: { containerItemId: item.id }}}
              extraColumns={[
                // extraColumn<'content'>({ id: 'item', select: { quantity: true, contentItem: { select: globalColumnDefinitions.item.select }}, title: `${t('itemTable.column.item')} (${t('container.quantity')})`, component: ItemContentQuantityColumn as TODO, order: 21 }),
                extraColumn<'content'>({ id: 'quantity', select: { quantity: true }, title: t('container.quantity'), component: ContentQuantityColumn as TODO, order: 71, align: 'end', small: true, orderBy: [{ quantity: 'desc' }, { quantity: 'asc' }] }),
              ]}
              defaultColumns={['item', 'quantity', 'type']}/>
          )}

          {item._count.contains === 0 && (
            <p>The contents of this container are unknown. You can help by adding the contained items.</p>
          )}
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
          {item.history.map((history) => (
            <tr key={history.revisionId}>
              <td style={{ paddingRight: 0 }}>{history.revisionId === revision.id && <Tip tip="Currently viewing"><Icon icon="eye"/></Tip>}</td>
              <td>
                <Tooltip content={<ItemLinkTooltip item={getLinkProperties(item)} language={language} revision={history.revisionId}/>}>
                  <NextLink href={`/item/${item.id}/${history.revisionId}`}>
                    {history.revision.description}
                  </NextLink>
                </Tooltip>
              </td>
              <td><FormatDate date={history.revision.createdAt} relative/></td>
              <td>
                {history.revisionId !== revision.id && (
                  <FlexRow>
                    <NextLink href={`/item/${item.id}/${history.revisionId}`}>View</NextLink> ·
                    <NextLink href={`/item/diff/${history.revisionId}/${revision.id}`}>Compare</NextLink>
                  </FlexRow>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {!fixedRevision && (
        <Suspense>
          <SimilarItems item={item}/>
        </Suspense>
      )}

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
};
