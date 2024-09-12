import type { FC } from 'react';

import { linkStyle } from '@/components/entity/entity-link-internal';
import { Skeleton } from '@/components/skeleton';

export interface SkeletonLinkProps {
  icon?: number | 'none';
}

export const SkeletonLink: FC<SkeletonLinkProps> = ({ icon = 32 }) => {
  if (icon === 'none') {
    return <Skeleton/>;
  }

  return (
    <div className={linkStyle}>
      <Skeleton width={icon} height={icon}/>
      <Skeleton/>
    </div>
  )
};
