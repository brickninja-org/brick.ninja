import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';

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

  // const showContents = item.type === 'Container';
  const canHaveContents = item.type === 'Container' || item.type === 'Set';

  return (
    <DetailLayout
      title={data.name}
      className=""
      breadcrumb={(
        <Breadcrumb>
          <BreadcrumbItem name="Items" href="/item"/>
          <BreadcrumbItem name={data.name}/>
        </Breadcrumb>
      )}
      infobox={<ItemInfobox item={item} data={data} language={language}/>}
      actions={[
        canHaveContents ? <EditContents key="edit-content" itemId={itemId} apperance="menu"/> : undefined,
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
