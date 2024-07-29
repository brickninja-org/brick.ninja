'use client';

import type { FC } from 'react';

import { cn } from '@brickninja-org/ui/lib';

import { useFormatContext } from './format-context';

interface FormatNumberProps {
  value: number | undefined | null;
  className?: string;
  unit?: string;
}

const format = new Intl.NumberFormat(undefined, { useGrouping: true });

export const FormatNumber: FC<FormatNumberProps> = ({ value, className, unit }) => {
  const { numberFormat } = useFormatContext();

  return (
    <data className={cn('', className)} value={value ?? undefined} suppressHydrationWarning>
      {value != null ? numberFormat.format(value) : '?'}
      {unit && `${unit}`}
    </data>
  );
};

export function formatNumber(value: number): string {
  return format.format(value);
}
