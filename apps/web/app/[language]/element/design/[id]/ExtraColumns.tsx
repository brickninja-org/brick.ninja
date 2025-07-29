'use client';

import type { FC } from 'react';
import type { Item } from '@brickninja-org/database';

import { FormatNumber } from '@/components/format/FormatNumber';

export interface ProductCountColumnProps {
  productIds: Item['productIds'];
}

export const ProductCountColumn: FC<ProductCountColumnProps> = ({ productIds }) => {
  const productCount = productIds.length ?? 0;

  return <FormatNumber value={productCount}/>;
};
