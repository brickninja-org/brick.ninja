import type { FC } from 'react';
import type { IconSize } from '@/lib/get-icon-url';

import { Skeleton } from '@/components/skeleton';

export interface SkeletonLinkProps {
  icon?: IconSize | 'none',
}

export const SkeletonLink: FC<SkeletonLinkProps> = ({ icon = 32 }) => {
  if (icon === 'none') {
    return <Skeleton className="h-4 w-full"/>;
  }

  return (
    <div className="flex items-center justify-self-start gap-2 overflow-hidden">
      <Skeleton className={`h-${icon / 4} w-${icon / 4} shrink-0 rounded-sm`}/>
      <div className="flex-1">
        <Skeleton className="h-4 w-full rounded-md"/>
      </div>
    </div>
  );
};
