'use client';

import type { FC } from 'react';
import type { RefProp } from '@brickninja-org/ui/lib/react';

import { cn } from '@brickninja-org/ui/lib';

import { useFormatContext } from './Format.context';

interface FormatPercentProps extends RefProp<HTMLDataElement> {
  value: number | bigint | undefined | null;
  className?: string;
}

const format = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 3 });

export const FormatPercent: FC<FormatPercentProps> = ({ value, className }) => {
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
