import type { FC, ReactNode } from 'react';

export interface MenuListProps {
  children: ReactNode,
}

export const MenuList: FC<MenuListProps> = ({ children }) => {
  return (
    <div className="flex flex-col">
      {children}
    </div>
  );
};
