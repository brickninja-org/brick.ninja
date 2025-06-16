import { Fragment, type FC, type ReactNode } from 'react';
import type { ProductTooltip } from './ProductTooltip';
import { isTruthy } from '@brickninja-org/helper/is';
import { FormatNumber } from '../format/FormatNumber';
import { FormatWeight } from '../format/FormatWeight';
import { EntityIcon } from '../entity/EntityIcon';

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
      {attributes.map(({ label, value, type }) => (
        <Fragment key={label}>
          <dt className="text-right">{typeof value === 'number'
            ? type === 'weightInGrams' ? <FormatWeight grams={value}/> : <FormatNumber value={value}/>
            : value
          }
          </dt>
          <dd className="ml-2">{label}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

export const ClientProductTooltip: FC<ClientProductTooltipProps> = ({ tooltip, hideTitle = false }) => {
  const data: ReactNode[] = [
    renderAttributes(tooltip.attributes),
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
        // eslint-disable-next-line react/no-array-index-key
        return <div key={index}>{content}</div>;
      })}
    </div>
  );
};
