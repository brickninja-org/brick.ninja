import { cloneElement, forwardRef, type FunctionComponent } from 'react';

import { cn } from '../lib';
import { getIcon, type IconColor, type IconProp } from './index';

export interface IconProps {
  icon: IconProp;
  color?: IconColor;
  className?: string;
}

export const Icon: FunctionComponent<IconProps> = forwardRef(function Icon({ icon, color, className }, ref) {
  const c = getIcon(icon);

  return c ? cloneElement(c, { className: cn('shrink-0 w-[--icon-size,1rem] h-[--icon-size,1rem] -vertical-[2px]', className), style: { '--icon-color': color }, ref }) : null;
});
