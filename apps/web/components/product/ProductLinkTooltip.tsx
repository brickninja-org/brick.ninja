'use client';

import type { FC } from 'react';
import type { Language, Product } from '@brickninja-org/database';
import type { LocalizedEntity } from '@/lib/localized-name';
import type { ProductTooltip } from './ProductTooltip';

import { ErrorBoundary } from 'react-error-boundary';

import { localizedName } from '@/lib/localized-name';
import { localizedUrl } from '@/lib/localized-url';
import { useJsonFetch } from '@/hooks/use-fetch';
import { useLanguage } from '@/components/i18n/context';
import { Skeleton } from '@/components/skeleton/Skeleton';
import { ClientProductTooltip } from './ProductTooltip.client';

export interface ProductLinkTooltipProps {
  product: Pick<Product, 'id' | keyof LocalizedEntity>,
  language?: Language,
  revision?: string,
}

export const ProductLinkTooltip: FC<ProductLinkTooltipProps> = ({ product, language, revision }) => {
  const defaultLanguage = useLanguage();
  language ??= defaultLanguage;

  const tooltip = useJsonFetch<ProductTooltip>(localizedUrl(`/product/${product.id}/tooltip${revision ? `?revision=${revision}` : ''}`, language));

  return (
    <div>
      <ErrorBoundary fallback={<span>Error</span>}>
        {tooltip.loading && (
          <>
            <div className="title">
              {localizedName(product, language)}
            </div>
            <div className="loading"><Skeleton/><br/><Skeleton width={120}/></div>
          </>
        )}
        {!tooltip.loading && <ClientProductTooltip tooltip={tooltip.data}/>}
      </ErrorBoundary>
    </div>
  );
};
