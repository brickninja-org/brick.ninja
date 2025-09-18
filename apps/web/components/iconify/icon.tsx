import { cloneElement, type FC } from 'react';
import type { RefProp } from '@brickninja-org/ui/lib/react';
import type { IconProp } from './index';

import { getIcon } from './index';

export interface IconProps extends RefProp {
  icon: IconProp,
  className?: string,
}

export const Icon: FC<IconProps> = ({ icon, className, ref }) => {
  const c = getIcon(icon);

  return c ? cloneElement(c, { className, ref }) : null;
};
