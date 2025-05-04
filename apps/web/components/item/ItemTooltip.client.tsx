import { use, type FC, type ReactNode } from 'react';

import { isTruthy } from '@brickninja-org/helper/is';

// import { FormatNumber } from '@/components/format/FormatNumber';
import { ItemTooltip } from '@/components/item/ItemTooltip';
import { EntityIcon } from '../entity/EntityIcon';
import { Tip } from '@brickninja-org/ui/components/tip/Tip';
import { DyeColor } from '../color/DyeColor';
import { hexToRgb } from '../color/hex-to-rgb';

export interface ClientItemTooltipProps {
  tooltip: ItemTooltip | Promise<ItemTooltip>;
  hideTitle?: boolean;
}

/*
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
*/

export const ClientItemTooltip: FC<ClientItemTooltipProps> = ({ tooltip, hideTitle }) => {
  tooltip = 'then' in tooltip ? use(tooltip) : tooltip;

  const data: ReactNode[] = [
    tooltip.elementId && (<div className="text-muted">ID: {tooltip.elementId}</div>),
    tooltip.type,
    tooltip.color && (
      <div>
        <div className="mb-1">
          {tooltip.color.name}
        </div>
        {tooltip.color.code && (
          <div className="flex gap-2">
            <Tip preferredPlacement="bottom" tip="Element">
              <DyeColor color={hexToRgb(tooltip.color.code)}/>
            </Tip>
          </div>
)}
      </div>
    ),
    /*
    tooltip.number && `${tooltip.number} v${tooltip.version}`,
    tooltip.theme,
    tooltip.releaseYear,
    tooltip.availablility,
    tooltip.pieces && `${tooltip.pieces} pieces`,
    tooltip.minifigures && `${tooltip.minifigures} minifigures`,
    tooltip.ages && `${tooltip.ages}+`,
    tooltip.dimensions && renderDimensions(tooltip.dimensions),
    tooltip.dimensions && tooltip.dimensions.weight && <FormatNumber value={tooltip.dimensions.weight} unit="Kg"/>,
    ...tooltip.flags,
    */
  ];

  return (
    <div>
      {!hideTitle && (
        <div className="flex items-center gap-2 mb-2 font-bitter">
          {tooltip.icon && (<EntityIcon icon={tooltip.icon} size={32}/>)}
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
