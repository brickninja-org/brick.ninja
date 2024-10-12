'use client';

import type { FC } from 'react';

import { cn } from '@brickninja-org/ui/lib';
import type { RefProp } from '@brickninja-org/ui/lib/react';

import { useFormatContext } from './format-context';

const NARROW_NO_BREAK_SPACE = '\u{202F}';

interface FormatNumberProps extends RefProp<HTMLDataElement> {
  value: number | bigint | undefined | null;
  className?: string;
  unit?: string;
}

const format = new Intl.NumberFormat(undefined, { useGrouping: true });

export const FormatNumber: FC<FormatNumberProps> = ({ ref, value, className, unit }) => {
  const { numberFormat } = useFormatContext();

  return (
    <data ref={ref} className={cn('whitespace-nowrap', className)} value={value?.toString() ?? undefined} suppressHydrationWarning>
      {value != null ? numberFormat.format(value) : '?'}
      {unit && `${NARROW_NO_BREAK_SPACE}${unit}`}
    </data>
  );
};

export function formatNumber(value: number): string {
  return format.format(value);
}
