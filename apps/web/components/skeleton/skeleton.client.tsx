'use client';

import type { SkeletonVariants } from './skeleton.styles';

import React, { type FC } from 'react';

import { skeletonVariants } from './skeleton.styles';
import type { RefProp } from '@brickninja-org/ui/lib/react';

/* -------------------------------------------------------------------------------------------------
 * Skeleton
 * -----------------------------------------------------------------------------------------------*/

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, RefProp<HTMLDivElement>, SkeletonVariants {}

const Skeleton: FC<SkeletonProps> = ({ ref, children, className, ...props }) => {
  const slots = React.useMemo(() => skeletonVariants({}), []);

  return (
    <div ref={ref} className={slots.base({ className })} {...props}>
      {children}
    </div>
  );
};

Skeleton.displayName = 'BrickCatalog.Skeleton';

export type { SkeletonProps };

export default Skeleton;
