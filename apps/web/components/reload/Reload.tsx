'use client';

import type { FC } from 'react';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export interface ReloadProps {
  intervalMs: number;
}

export const Reload: FC<ReloadProps> = ({ intervalMs }) => {
  const [isLoading, startLoading] = useTransition();

  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const timeout = setTimeout(() => {
      startLoading(() => router.refresh());
    }, intervalMs);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, intervalMs, router]);

  return null;
};
