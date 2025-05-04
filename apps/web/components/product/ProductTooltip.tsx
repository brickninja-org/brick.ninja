import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { Product as ApiProduct } from 'types/product';


import { ClientProductTooltip } from './ProductTooltip.client';
import { getTranslate, type TranslationId } from '@/lib/translate';
export interface ProductTooltipProps {
  product: ApiProduct;
  language: Language;
  hideTitle?: boolean;
}

export const ProductTooltip: FC<ProductTooltipProps> = async ({ product, language, hideTitle }) => {
  const tooltip = await createTooltip(product, language);

  return (
    <ClientProductTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export interface ProductTooltip {
  language: Language;
  name: string;
  attributes?: { label: string, type: string, value: number | string }[],
}

// eslint-disable-next-line require-await
export async function createTooltip(product: ApiProduct, language: Language): Promise<ProductTooltip> {
  const t = getTranslate(language);

  return {
    language,
    name: product.name,
    attributes: product.details?.attributes && product.details.attributes.length > 0
      ? product.details.attributes.map(({ type, value }) => ({ label: t(`product.attributes.${type}` as TranslationId), value: type === 'ageRange' ? `${value}+` : value, type }))
      : undefined,
  };
}
