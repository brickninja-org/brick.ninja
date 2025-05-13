import type { FC } from 'react';
import type { RefProp } from '../lib/react';
import type { IconColor, IconProp } from './index';

import { cloneElement } from 'react';

import { cn } from '../lib';
import { getIcon } from './index';

export interface IconProps extends RefProp {
  icon: IconProp;
  color?: IconColor;
  className?: string;
}

export const Icon: FC<IconProps> = ({ ref, icon, color, className }) => {
  const c = getIcon(icon);

  return c ? cloneElement(c, { className: cn('inline shrink-0 w-(--icon-size,16px) h-(--icon-size,16px) vertical-[-2px] text-(--icon-color,currentColor)', className), style: { '--icon-color': color }, ref }) : null;
};
