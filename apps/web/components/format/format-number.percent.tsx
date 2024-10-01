'use client';

import type { FC } from 'react';

import { cn } from '@brickninja-org/ui/lib';

import { useFormatContext } from './format-context';

interface FormatNumberPercentProps {
  value: number | bigint | undefined | null;
  className?: string;
}

const format = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 3 });

export const FormatNumberPercent: FC<FormatNumberPercentProps> = ({ value, className }) => {
  const { numberFormatPercent } = useFormatContext();

  return (
    <data className={cn('whitespace-nowrap', className)} value={value?.toString() ?? undefined} suppressHydrationWarning>
      {value != null ? numberFormatPercent.format(value) : '?'}
    </data>
  );
};

export function formatNumber(value: number): string {
  return format.format(value);
}
