'use client';

import { type FC } from 'react';

import type { Item, Language } from '@brickninja-org/database';

import type { LocalizedEntity } from '@/lib/localized-name';
import { getLinkProperties } from '@/lib/link-properties';
import { EntityLink } from '@/components/entity/entity-link';

export interface ItemLinkProps {
  className?: string;
  item: Pick<Item, 'id' | 'type' | keyof LocalizedEntity>;
  language?: Language;
  revision?: string;
}

export const ItemLink: FC<ItemLinkProps> = ({ className, item, language, revision }) => {
  const entity = getLinkProperties(item);

  return (
    <div className="min-w-48 max-w-64">
      <EntityLink
        className={className}
        entity={entity}
        href={`/item/${entity.id}${revision ? `/${revision}` : ''}`}
        language={language}/>
    </div>
  );
};
