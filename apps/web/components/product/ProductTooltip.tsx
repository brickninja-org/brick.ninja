import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { Product as ApiProduct, ProductAttribute } from '@brickninjaapi/types/data/product';

import { ClientProductTooltip } from './ProductTooltip.client';
import { parseIcon } from '@/lib/parse-icon';
import { FormatNumber } from '../format/FormatNumber';
import { FormatWeight } from '../format/FormatWeight';

export interface ProductTooltipProps {
  product: ApiProduct,
  language: Language,
  hideTitle?: boolean,
}

export const ProductTooltip: FC<ProductTooltipProps> = async ({ product, language, hideTitle }) => {
  const tooltip = await createTooltip(product, language);

  return (
    <ClientProductTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export interface ProductTooltip {
  language: Language,
  id: number,
  name: string,
  icon?: { id: number, signature: string, extension: string },
  attributes?: ProductAttribute[],
}

// eslint-disable-next-line require-await
export async function createTooltip(product: ApiProduct, language: Language): Promise<ProductTooltip> {
  const icon = parseIcon(product.icon);

  return {
    language,
    id: product.id,
    name: product.name,
    icon,
    attributes: product.details?.attributes
  };
}

export interface AttributeProps {
  attribute: ProductAttribute,
}

export const Attribute: FC<AttributeProps> = ({ attribute }) => {
  return (
    <>
      <dt className="text-right">{renderText(attribute)}</dt>
      <dd className="ml-2">{attribute.text.toLocaleLowerCase()}</dd>
    </>
  );
};

function renderText(attribute: ProductAttribute) {
  switch (attribute.type) {
    case 'ageRange':
      return <><FormatNumber value={Number(attribute.value)}/>+</>;
    case 'figureCount':
    case 'pieceCount':
      return <FormatNumber value={Number(attribute.value)}/>;
    case 'weightInGrams':
      return <FormatWeight grams={Number(attribute.value)}/>;
    default:
      return;
  }
}
