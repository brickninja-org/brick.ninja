'use client';

import type { FC } from 'react';

import { cn } from '@brickninja-org/ui/lib';

import { useFormatContext } from './format-context';

interface FormatCurrencyProps {
  value: number | bigint | undefined | null;
  className?: string;
}

const format = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' });

export const FormatCurrency: FC<FormatCurrencyProps> = ({ value, className }) => {
  const { numberFormatCurrency } = useFormatContext();

  return (
    <data className={cn('whitespace-nowrap', className)} value={value?.toString() ?? undefined} suppressHydrationWarning>
      {value != null && numberFormatCurrency.format(value)}
    </data>
  );
};

export function formatCurrency(value: number): string {
  return format.format(value);
}