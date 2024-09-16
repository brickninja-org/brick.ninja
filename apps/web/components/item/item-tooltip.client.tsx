import { type FC, type ReactNode } from 'react';

import { isTruthy } from '@brickninja-org/helper/is';

import { ItemTooltip } from '@/components/item/item-tooltip';
import { FormatNumber } from '../format/format-number';

export interface ClientItemTooltipProps {
  tooltip: ItemTooltip;
  hideTitle?: boolean;
}

function renderDimensions(dimensions: { height?: number; width?: number; depth?: number }) {
  return (
    <>
      {dimensions.height && <FormatNumber value={dimensions.height} unit="cm"/>}
      {dimensions.width && dimensions.depth && ' x '}
      {dimensions.width && <FormatNumber value={dimensions.width} unit="cm"/>}
      {dimensions.depth && dimensions.height && ' x '}
      {dimensions.depth && <FormatNumber value={dimensions.depth} unit="cm"/>}
    </>
  );
}

export const ClientItemTooltip: FC<ClientItemTooltipProps> = ({ tooltip, hideTitle }) => {
  const data: ReactNode[] = [
    tooltip.number && `${tooltip.number} v${tooltip.version}`,
    tooltip.theme,
    tooltip.release,
    tooltip.availablility,
    tooltip.pieces && `${tooltip.pieces} pieces`,
    tooltip.minifigures && `${tooltip.minifigures} minifigures`,
    tooltip.ages && `${tooltip.ages}+`,
    tooltip.dimensions && renderDimensions(tooltip.dimensions),
    tooltip.dimensions && tooltip.dimensions.weight && <FormatNumber value={tooltip.dimensions.weight} unit="Kg"/>,
  ];

  return (
    <div>
      {!hideTitle && (
        <div className="flex items-center gap-2 mb-2 font-bitter">
          {tooltip.name}
        </div>
      )}

      {data.filter(isTruthy).map((content, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return <div className="mt" key={index}>{content}</div>;
      })}
    </div>
  );
};
