import type { FC } from 'react';
import type { RGB } from './types';

import { cn } from '@brickninja-org/ui/lib';

import { isDark } from './is-dark';

interface DyeColorProps {
  color: RGB;
}

export const DyeColor: FC<DyeColorProps> = ({ color }) => {
  return (
    <div className={cn('w-16 h-8 rounded-xs border', isDark(color) ? 'border-transparent dark:border-[rgba(255_255_255_/_.1)]' : 'border-[rgba(0_0_0_/_.2)]')} style={{ backgroundColor: `rgb(${color.join(' ')})` }}/>
  );
};
