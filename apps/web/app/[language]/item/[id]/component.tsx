import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';

import NextLink from 'next/link';
import { notFound } from 'next/navigation';

import { Headline } from '@brickninja-org/ui/components/headline';
import { Notice } from '@brickninja-org/ui/components/notice';
import { TableOfContentAnchor } from '@brickninja-org/ui/components/table-of-content';

import DetailLayout from '@/components/layout/detail-layout';
import { Breadcrumb, BreadcrumbItem } from '@/components/breadcrumb';
import { ItemInfobox } from '@/components/item/item-infobox';
import { Json } from '@/components/format/json';

import { getItem, getRevision } from './data';
import { ItemTooltip } from '@/components/item/item-tooltip';
import { EditContents } from './_edit-content/edit-contents';

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
        canHaveContents ? <EditContents key="edit-content" apperance="menu"/> : undefined,
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

      <Headline id="data">Data</Headline>
      <Json data={data} borderless/>
    </DetailLayout>
  );
};
