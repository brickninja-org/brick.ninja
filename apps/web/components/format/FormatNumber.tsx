'use client';

import type { FC } from 'react';
import type { RefProp } from '@brickninja-org/ui/lib/react';

import { cn } from '@brickninja-org/ui/lib';

import { useFormatContext } from './Format.context';

const NARROW_NO_BREAK_SPACE = '\u{202F}';

interface FormatNumberProps extends RefProp<HTMLDataElement> {
  value: number | bigint | undefined | null;
  className?: string;
  variant?: 'normal-nums' | 'tabular-nums';
  unit?: string;
}

const format = new Intl.NumberFormat(undefined, { useGrouping: true });

export const FormatNumber: FC<FormatNumberProps> = ({ ref, value, className, variant, unit }) => {
  const { numberFormat } = useFormatContext();

  return (
    <data ref={ref} className={cn(['whitespace-nowrap', variant], className)} value={value?.toString() ?? undefined} suppressHydrationWarning>
      {value != null ? numberFormat.format(value) : '?'}
      {unit && `${NARROW_NO_BREAK_SPACE}${unit}`}
    </data>
  );
};

export function formatNumber(value: number): string {
  return format.format(value);
}
