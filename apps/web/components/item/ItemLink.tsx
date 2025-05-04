'use client';

import type { FC } from 'react';
import type { Item, Language } from '@brickninja-org/database';
import type { IconSize } from '@/lib/get-icon-url';
import type { LocalizedEntity } from '@/lib/localized-name';
import type { WithIcon } from '@/lib/with';

import { getLinkProperties } from '@/lib/link-properties';
import { EntityLink } from '@/components/entity/EntityLink';
import { ItemLinkTooltip } from '@/components/item/ItemLinkTooltip';
import { Tooltip } from '@/components/tooltip/Tooltip';

export interface ItemLinkProps {
  className?: string;
  item: WithIcon<Pick<Item, 'id' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  language?: Language;
  revision?: string;
}

export const ItemLink: FC<ItemLinkProps> = ({ className, item, icon = 32, language, revision }) => {
  const entity = getLinkProperties(item);

  return (
    <Tooltip content={<ItemLinkTooltip item={entity} language={language} revision={revision}/>}>
      <EntityLink
        className={className}
        entity={entity}
        icon={icon}
        href={`/item/${entity.id}${revision ? `/${revision}` : ''}`}
        language={language}/>
    </Tooltip>
  );
};
