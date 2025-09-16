import type { FC } from 'react';
import type { IconSize } from '@/lib/get-icon-url';

import { cn } from '@heroui/react';

export interface EntityIconMissingProps {
  size: IconSize | number,
  className?: string,
}

export const EntityIconMissing: FC<EntityIconMissingProps> = ({ size = 64, className }) => {
  return (
    <span className={cn(['inline-block shrink-0 rounded-xs bg-background-light text-muted text-center', 'before:content-["?"] before:opacity-[.5]', 'w-(--icon-size) h-(--icon-size) leading-(--icon-size)', className])} style={{ '--icon-size': `${size}px` }}/>
  );
};
