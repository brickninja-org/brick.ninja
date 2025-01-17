'use client';

import type { FC } from 'react';
import type { Item, Language } from '@brickninja-org/database';
import type { LocalizedEntity } from '@/lib/localized-name';

import { getLinkProperties } from '@/lib/link-properties';
import { EntityLink } from '@/components/entity/EntityLink';
import { ItemLinkTooltip } from '@/components/item/ItemLinkTooltip';
import { Tooltip } from '@/components/tooltip/Tooltip';

export interface ItemLinkProps {
  className?: string;
  item: Pick<Item, 'id' | keyof LocalizedEntity>;
  language?: Language;
  revision?: string;
}

export const ItemLink: FC<ItemLinkProps> = ({ className, item, language, revision }) => {
  const entity = getLinkProperties(item);

  return (
    <Tooltip content={<ItemLinkTooltip item={entity} language={language} revision={revision}/>}>
      <EntityLink
        className={className}
        entity={entity}
        href={`/item/${entity.id}${revision ? `/${revision}` : ''}`}
        language={language}/>
    </Tooltip>
  );
};
