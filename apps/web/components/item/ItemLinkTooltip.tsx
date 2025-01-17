'use client';

import type { FC } from 'react';
import type { Item, Language } from '@brickninja-org/database';
import type { LocalizedEntity } from '@/lib/localized-name';

import { ErrorBoundary } from 'react-error-boundary';

import { useJsonFetch } from '@/hooks/use-fetch';
import { localizedName } from '@/lib/localized-name';
import { localizedUrl } from '@/lib/localized-url';
import { useLanguage } from '@/components/i18n/context';
import { ItemTooltip } from '@/components/item/ItemTooltip';
import { ClientItemTooltip } from '@/components/item/ItemTootip.client';
import { Skeleton } from '@/components/skeleton/Skeleton';

export interface ItemLinkTooltipProps {
  item: Pick<Item, 'id' | keyof LocalizedEntity>;
  language?: Language;
  revision?: string;
}

export const ItemLinkTooltip: FC<ItemLinkTooltipProps> = ({ item, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetch<ItemTooltip>(localizedUrl(`/item/${item.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div className="">
      <ErrorBoundary fallback={<span>Error</span>}>
        {tooltip.loading && (
          <>
            <div className="flex items-center gap-2 mb-2 font-bitter">
              {localizedName(item, language)}
            </div>
            <div className="leading-6"><Skeleton/><br/><Skeleton width={120}/></div>
          </>
        )}
        {!tooltip.loading && <ClientItemTooltip tooltip={tooltip.data}/>}
      </ErrorBoundary>
    </div>
  );
};
