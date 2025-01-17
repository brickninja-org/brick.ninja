import type { FC } from 'react';

import { cn } from '@brickninja-org/ui/lib';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Skeleton: FC<SkeletonProps> = ({ width = '100%', height = 16, className }) => {
  return <span className={cn('inline-block width-[10em] height-[1em] bg-gray-200 align-bottom text-transparent animate-pulse', className)} style={{ width, height }}/>;
};
