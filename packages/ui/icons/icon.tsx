import { cloneElement, type FC } from 'react';

import { cn } from '../lib';
import type { RefProp } from '../lib/react';
import { getIcon, type IconColor, type IconProp } from './index';

export interface IconProps extends RefProp {
  icon: IconProp;
  color?: IconColor;
  className?: string;
}

export const Icon: FC<IconProps> = ({ ref, icon, color, className }) => {
  const c = getIcon(icon);

  return c ? cloneElement(c, { className: cn('shrink-0 w-(--icon-size,1rem) h-(--icon-size,1rem) -vertical-[2px]', className), style: { '--icon-color': color }, ref }) : null;
};
