'use client';

import { Suspense, type FC } from 'react';
import type { Item, Language } from '@brickninja-org/database';
import { localizedName, type LocalizedEntity } from '@/lib/localized-name';

import { ErrorBoundary } from 'react-error-boundary';

import { useJsonFetchPromise } from '@/hooks/use-fetch';
import { localizedUrl } from '@/lib/localized-url';
import { useLanguage } from '@/components/i18n/context';
import { ItemTooltip } from '@/components/item/ItemTooltip';
import { ClientItemTooltip } from '@/components/item/ItemTooltip.client';
import { EntityIcon } from '../entity/EntityIcon';
import { Skeleton } from '../skeleton/Skeleton';
import type { WithIcon } from '@/lib/with';

export interface ItemLinkTooltipProps {
  item: WithIcon<Pick<Item, 'id' | keyof LocalizedEntity>>;
  language?: Language;
  revision?: string;
}

export const ItemLinkTooltip: FC<ItemLinkTooltipProps> = ({ item, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetchPromise<ItemTooltip>(localizedUrl(`/item/${item.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div className="">
      <ErrorBoundary fallback={<ItemLinkTooltipFallback item={item} language={language} error/>}>
        <Suspense fallback={<ItemLinkTooltipFallback item={item} language={language}/>}>
          <ClientItemTooltip tooltip={tooltip}/>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

type ItemLinkTooltipInternalProps = ItemLinkTooltipProps & { language: Language; error?: boolean; };

const ItemLinkTooltipFallback: FC<ItemLinkTooltipInternalProps> = ({ item, language, error }) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-2 font-bitter">
        {item.icon && (<EntityIcon icon={item.icon} size={32}/>)}
        {localizedName(item, language)}
      </div>
      {error
        ? (<div className="text-(--color-error)">Error loading tooltip</div>)
        : (<div className="leading-normal"><Skeleton/><br/><Skeleton width={120}/></div>)}
    </>
  );
};
