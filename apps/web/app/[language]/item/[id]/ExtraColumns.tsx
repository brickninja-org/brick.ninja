'use client';

import type { FC } from 'react';

import { FormatNumber } from '@/components/format/FormatNumber';

export interface ContentQuantityColumnProps {
  content: { quantity: number };
}

export const ContentQuantityColumn: FC<ContentQuantityColumnProps> = ({ content }) => {
  return <FormatNumber value={content.quantity}/>;
};
