'use client';

/* eslint-disable @next/next/no-img-element */
import type { FC, RefCallback } from 'react';
import type { Icon } from '@brickninja-org/database';

import { useCallback, useMemo, useState } from 'react';
import { cn } from '@heroui/react';

import { getIconSize, getIconUrl, type FixedIconSize, type IconSize } from '@/lib/get-icon-url';

export type EntityIconType = 'product';

export interface EntityIconProps {
  icon: Omit<Icon, 'color' | 'signature' | 'extension'> & Partial<Pick<Icon, 'color' | 'signature' | 'extension'>>,
  size?: IconSize,
  type?: EntityIconType,
  className?: string,
}

export const EntityIcon: FC<EntityIconProps> = ({ icon, size = 64, type, className }) => {
  const scaledIconSize = type === 'product' ? size * 1.3333 : size;
  const iconSize = getIconSize(scaledIconSize);

  const [loading, setLoading] = useState(true);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const handleRef: RefCallback<HTMLImageElement> = useCallback((img) => {
    if (img?.complete) {
      setLoading(false);
    }
  }, []);

  const style = useMemo(() => icon.color ? { '--loading-color': icon.color } : undefined, [icon.color]);

  return (
    <span className={cn('[grid-area:icon] inline-flex items-center justify-center bg-background border border-(--color-border-dark) shrink-0 rounded-xs aspect-square overflow-hidden', className)} data-icon-type={type}>
      <img
        loading="lazy"
        decoding="async"
        ref={handleRef}
        src={getIconUrl(icon, iconSize, type)}
        width={size}
        height={size}
        alt=""
        referrerPolicy="no-referrer"
        srcSet={iconSize < 64 ? `${getIconUrl(icon, iconSize * 2 as FixedIconSize, type)} 2x` : undefined}
        style={style}
        className={cn(loading && 'bg-background-light', 'object-cover')}
        onLoad={handleLoad}/>
    </span>
  );
};
