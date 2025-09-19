import type { FC } from 'react';
import type { IconSize } from '@/lib/get-icon-url';

import { Skeleton } from '@heroui/react';

export interface SkeletonLinkProps {
  icon?: IconSize | 'none',
}

export const SkeletonLink: FC<SkeletonLinkProps> = ({ icon = 32 }) => {
  if (icon === 'none') {
    return <Skeleton className="h-4 w-full"/>;
  }

  return (
    <div className="inline-flex items-center justify-self-start w-full gap-2 overflow-hidden">
      <Skeleton className={`h-${icon / 4} w-${icon / 4} shrink-0 rounded-sm`}/>
      <Skeleton className="h-4 flex-1 rounded-md"/>
    </div>
  );
};
