import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';

import { notFound } from 'next/navigation';

import { TableOfContentAnchor } from '@brickninja-org/ui/components/table-of-content';

import DetailLayout from '@/components/layout/detail-layout';
import { ItemInfobox } from '@/components/item/item-infobox';

import { getItem, getRevision } from './data';
import { Headline } from '@brickninja-org/ui/components/headline';
import { Json } from '@/components/format/json';

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

  // const fixedRevision = revisionId !== undefined;

  return (
    <DetailLayout
      title={data.name}
      className=""
      infobox={<ItemInfobox item={item} data={data} language={language}/>}
    >
      <TableOfContentAnchor id="tooltip">Tooltip</TableOfContentAnchor>

      <Headline id="data">Data</Headline>
      <Json data={data} borderless/>
    </DetailLayout>
  );
};
