import { Suspense, type FC } from 'react';

import NextLink from 'next/link';
import { notFound } from 'next/navigation';
import { MdOutlineRemoveRedEye } from 'react-icons/md';

import type { Language } from '@brickninja-org/database';
import { Headline } from '@brickninja-org/ui/components/headline';
import { Notice } from '@brickninja-org/ui/components/notice';
import { Table } from '@brickninja-org/ui/components/table';
import { TableOfContentAnchor } from '@brickninja-org/ui/components/table-of-content';
import { Tip } from '@brickninja-org/ui/components/tip';

import { getLinkProperties } from '@/lib/link-properties';
import { pageView } from '@/lib/page-view';
import DetailLayout from '@/components/layout/detail-layout';
import { Breadcrumb, BreadcrumbItem } from '@/components/breadcrumb';
import { FormatDate } from '@/components/format/format-date';
import { ItemInfobox } from '@/components/item/item-infobox';
import { ItemLinkTooltip } from '@/components/item/item-link-tooltip';
import { ItemTooltip } from '@/components/item/item-tooltip';
import { Json } from '@/components/format/json';
import { Tooltip } from '@/components/tooltip';

import { EditContents } from './_edit-content/edit-contents';
import { getItem, getRevision } from './data';
import { SimilarItems } from './similar-items';

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
              <td style={{ paddingRight: 0 }}>{history.revisionId === revision.id && <Tip tip="Currently viewing"><MdOutlineRemoveRedEye/></Tip>}</td>
              <td>
                <Tooltip content={<ItemLinkTooltip item={getLinkProperties(item)} language={language} revision={history.revisionId}/>}>
                  <NextLink href={`/item/${item.id}/${history.revisionId}`}>
                    {history.revision.description}
                  </NextLink>
                </Tooltip>
              </td>
              <td><FormatDate date={history.revision.createdAt} relative/></td>
              <td>{history.revisionId !== revision.id && <NextLink href={`/item/${item.id}/${history.revisionId}`}>View</NextLink>}</td>
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
