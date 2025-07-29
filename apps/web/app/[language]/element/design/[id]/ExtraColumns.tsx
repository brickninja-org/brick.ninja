import type { FC } from 'react';
import type { Item } from '@brickninja-org/database';
import { FormatNumber } from '@/components/format/FormatNumber';

export interface ProductIdsColumnProps {
  productIds: Item['productIds'];
}

export const ProductIdsColumn: FC<ProductIdsColumnProps> = ({ productIds }) => {
  return <FormatNumber value={productIds.length}/>;
};
