import type { FC } from 'react';
import type { Language, Product } from '@brickninja-org/database';
import type { LocalizedEntity } from '@/lib/localized-name';

import { getLinkProperties } from '@/lib/link-properties';
import { EntityLink } from '@/components/entity/EntityLink';
import { Tooltip } from '@/components/tooltip/Tooltip';
import { ProductLinkTooltip } from './ProductLinkTooltip';
import type { IconSize } from '@/lib/get-icon-url';

export interface ProductLinkProps {
  product: Pick<Product, 'id' | keyof LocalizedEntity>;
  icon?: IconSize | 'none';
  language?: Language;
  revision?: string;
}

export const ProductLink: FC<ProductLinkProps> = ({ product, icon = 32, language, revision }) => {
  const entity = getLinkProperties(product);

  return (
    <Tooltip content={<ProductLinkTooltip product={product} language={language} revision={revision}/>}>
      <EntityLink href={`/product/${product.id}`} entity={entity} icon={icon} iconType="product" language={language}/>
    </Tooltip>
  );
};
