import { type FC, type ReactNode } from 'react';

import { ItemTooltip } from '@/components/item/item-tooltip';
import { isTruthy } from '@brickninja-org/helper/is';

export interface ClientItemTooltipProps {
  tooltip: ItemTooltip;
  hideTitle?: boolean;
}

export const ClientItemTooltip: FC<ClientItemTooltipProps> = ({ tooltip, hideTitle }) => {
  const data: ReactNode[] = [
    tooltip.number && `${tooltip.number} v${tooltip.version}`,
    tooltip.theme,
    tooltip.release,
    tooltip.availablility,
    tooltip.pieces && `${tooltip.pieces} pieces`,
    tooltip.minifigures && `${tooltip.minifigures} minifigures`,
  ];

  return (
    <div>
      {!hideTitle && (
        <div className="">
          {tooltip.name}
        </div>
      )}

      {data.filter(isTruthy).map((content, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return <div className="" key={index}>{content}</div>;
      })}
    </div>
  );
};
