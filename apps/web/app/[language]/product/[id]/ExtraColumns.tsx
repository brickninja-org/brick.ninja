'use client';

import type { FC } from 'react';

export interface ItemBarcodeColumnProps {
  item: { barcode: string },
}

export const ItemBarcodeColumn: FC<ItemBarcodeColumnProps> = ({ item }) => {
  return <>{item.barcode}</>;
};
