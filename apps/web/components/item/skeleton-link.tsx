import type { FC } from 'react';

import { Skeleton } from '@/components/skeleton';
import { cn } from '@brickninja-org/ui/lib';

export interface SkeletonLinkProps {
  icon?: number | 'none';
}

export const SkeletonLink: FC<SkeletonLinkProps> = ({ icon = 32 }) => {
  if (icon === 'none') {
    return <Skeleton/>;
  }

  return (
    <div className={cn([
      'inline-flex',
      'items-center',
      '[justify-self:_flex-start]',
      'gap-2',
      'overflow-hidden',
    ])}
    >
      <Skeleton width={icon} height={icon}/>
      <Skeleton/>
    </div>
  );
};
