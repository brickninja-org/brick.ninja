import type React from 'react';
import type { IconifyProps } from './iconify.client';

import { Icon as Iconify } from '@iconify/react';
import gravityIcons from '@iconify-json/gravity-ui/icons.json';

export type IconName = keyof typeof gravityIcons.icons;

export type { IconifyProps } from './iconify.client';
export { Iconify } from './iconify.client';

export type IconProp = IconName | React.JSX.Element;

const iconsMap = new Set<IconName>(Object.keys(gravityIcons.icons) as IconName[]);

export function getIcon(icon: IconName): React.ReactElement<IconifyProps>;
export function getIcon(icon?: IconProp): React.JSX.Element | undefined;
export function getIcon(icon?: IconProp): React.JSX.Element | undefined {
  if (typeof icon === 'string') {
    if (iconsMap.has(icon as IconName)) {
      const gravityIconData = gravityIcons.icons[icon as IconName];
      return <Iconify icon={gravityIconData}/>;
    }

    return undefined;
  }

  return icon;
}

export * from './icon';
