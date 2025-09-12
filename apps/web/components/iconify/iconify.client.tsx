'use client';

import type { FC } from 'react';
import type { IconProps } from '@iconify/react';
import type { RefProp } from '@brickninja-org/ui/lib/react';

import { Icon } from '@iconify/react';
import { Icon as OfflineIcon } from '@iconify/react/dist/offline';
import lucideIcons from '@iconify-json/lucide/icons.json';

type IconName = keyof typeof lucideIcons.icons;

export interface IconifyProps extends IconProps, RefProp<SVGSVGElement> {
  icon: IconProps['icon'] | string;
}

const icons = {
  ...lucideIcons.icons,
};

// TODO: Hydration error
const Iconify: FC<IconifyProps> = ({ ref, icon: iconProp, ...props }) => {
  // Check if it's a lucide icon (no prefix or explicitly in lucide icons)
  const isLucideIcon =
    typeof iconProp === 'string' && (iconProp in icons || !iconProp.includes(':'));

  if (isLucideIcon && typeof iconProp === 'string') {
    const lucideIconData = icons[iconProp as IconName];

    if (lucideIconData) {
      return <OfflineIcon {...props} ref={ref} icon={lucideIconData}/>;
    }
  }

  // Use online version for other icon sets (like simple-icons:vite, lineicons:nextjs)
  return <Icon {...props} ref={ref} icon={iconProp}/>;
};

Iconify.displayName = 'BrickCatalog.Iconify';

export { Iconify };
