'use client';

import type { FC } from 'react';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@brickninja-org/ui/components/form/Select';

import { availablePeriods } from './available-periods';

export const PeriodSelect: FC = () => {
  const value = useSearchParams().get('period') ?? '24h';
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = useCallback((value: string) => {
    replace(`${pathname}?period=${value}`);
  }, [pathname, replace]);

  return <Select options={availablePeriods} value={value} onChange={handleChange}/>;
};
