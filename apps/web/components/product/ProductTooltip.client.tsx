/* eslint-disable react/no-array-index-key */

import type { FC } from 'react';
import type { ProductTooltip } from './ProductTooltip';

import { EntityIcon } from '@/components/entity/EntityIcon';

import { Attribute } from './ProductTooltip';

export interface ClientProductTooltipProps {
  tooltip: ProductTooltip;
  hideTitle?: boolean;
}

export const ClientProductTooltip: FC<ClientProductTooltipProps> = ({ tooltip, hideTitle = false }) => {
  return (
    <div className="not-first:mt-2">
      {!hideTitle && (
        <div className="flex items-center gap-2 mb-2 font-bitter">
          {tooltip.icon && (<EntityIcon icon={tooltip.icon} size={32} type="product"/>)}
          {tooltip.name}
        </div>
      )}

      {tooltip.attributes?.map((attribute, index) => (attribute.type !== 'dimensionsInMillimeters') && <Attribute key={index} attribute={attribute}/>)}
    </div>
  );
};
