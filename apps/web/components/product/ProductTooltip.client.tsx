/* eslint-disable react/no-array-index-key */

import type { FC, ReactNode } from 'react';
import type { ProductTooltip } from './ProductTooltip';

import { isTruthy } from '@brickninja-org/helper/is';
import { EntityIcon } from '@/components/entity/EntityIcon';

import { Attribute } from './ProductTooltip';

export interface ClientProductTooltipProps {
  tooltip: ProductTooltip;
  hideTitle?: boolean;
}

function renderAttributes(attributes: ProductTooltip['attributes']) {
  if (!attributes) {
    return;
  }

  return (
    <dl className="grid grid-cols-[auto_1fr] leading-5">
      {attributes.map((attribute, index) => (
        <Attribute key={index} attribute={attribute}/>
      ))}
    </dl>
  );
}

export const ClientProductTooltip: FC<ClientProductTooltipProps> = ({ tooltip, hideTitle = false }) => {
  const data: ReactNode[] = [
    tooltip.id && (<><span className="text-gray-500">#</span> {tooltip.id} item</>),
    renderAttributes(tooltip.attributes)
  ];

  return (
    <div className="not-first:mt-2">
      {!hideTitle && (
        <div className="flex items-center gap-2 mb-2 font-bitter">
          {tooltip.icon && (<EntityIcon icon={tooltip.icon} size={32} type="product"/>)}
          {tooltip.name}
        </div>
      )}

      {data.filter(isTruthy).map((content, index) => {
        return <div className="mt-2" key={index}>{content}</div>;
      })}
    </div>
  );
};
