import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { Product as ApiProduct } from '@brickninjaapi/types/data/product';

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
  icon?: { id: number, signature: string; extension: string };
  attributes?: { label: string, type: string, value: number | string | [number, number, number] }[],
}

// eslint-disable-next-line require-await
export async function createTooltip(product: ApiProduct, language: Language): Promise<ProductTooltip> {
  const t = getTranslate(language);

  return {
    language,
    name: product.name,
    attributes: product.details?.attributes && product.details.attributes.length > 0
      ? product.details.attributes.map(({ text, type, value }) => {
        let formattedValue: string | number | undefined = '';

        if (type === 'dimensionsInMillimeters' && Array.isArray(value)) {
          const [h, b, d] = value as [number, number, number];

          const format = (mm: number): string => {
            const cm = Math.round(mm / 10);
            const inch = Math.round((cm / 2.54) * 10) / 10;
            return `${inch}" (${cm}cm)`;
          };

          formattedValue = [
            `H: ${format(h)}`,
            `B: ${format(b)}`,
            `D: ${format(d)}`
          ].join('\n');
        } else if (type === 'ageRange' && typeof value === 'number') {
          formattedValue = `${value}+`;
        }
 
        return {
          label: t(`product.attributes.${text}` as TranslationId),
          value: formattedValue,
          type
        };
      })
      : undefined,
  };
}
