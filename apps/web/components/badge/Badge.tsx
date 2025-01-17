import type { FC, ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode
}

export const Badge: FC<BadgeProps> = ({ children }) => (
  <span className="ml-2 py-[1px] px-1 bg-white border border-blue-600 rounded-xs align-[2px] leading-3 font-medium text-blue-600 text-[10px] uppercase">
    {children}
  </span>
);
