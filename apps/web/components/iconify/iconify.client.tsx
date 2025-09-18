'use client';

import type { FC } from 'react';
import type { IconProps } from '@iconify/react';
import type { RefProp } from '@brickninja-org/ui/lib/react';

import { Icon } from '@iconify/react';
import { Icon as OfflineIcon } from '@iconify/react/dist/offline';
import gravityIcons from '@iconify-json/gravity-ui/icons.json';

export type IconifyName = keyof typeof gravityIcons.icons;

export interface IconifyProps extends IconProps, RefProp<SVGSVGElement> {
  icon: IconifyName,
}

const icons = {
  ...gravityIcons.icons,
};

// TODO: Hydration error
const Iconify: FC<IconifyProps> = ({ ref, icon: iconProp, ...props }) => {
  // Check if it's a gravity icon (no prefix or explicitly in gravity icons)
  const isGravityIcon =
    typeof iconProp === 'string' && (iconProp in icons || !iconProp.includes(':'));

  if (isGravityIcon && typeof iconProp === 'string') {
    const gravityIconData = icons[iconProp as IconifyName];

    if (gravityIconData) {
      return <OfflineIcon {...props} ref={ref} icon={gravityIconData}/>;
    }
  }

  // Use online version for other icon sets (like simple-icons:vite, lineicons:nextjs)
  return <Icon {...props} ref={ref} icon={iconProp}/>;
};

Iconify.displayName = 'BrickCatalog.Iconify';

export { Iconify };
