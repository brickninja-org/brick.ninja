import { cn } from '@brickninja-org/ui/lib';
import { type FC, type ReactNode } from 'react';
import { tv } from 'tailwind-variants';

export interface ItemListProps {
  children: ReactNode[];
  singleColumn?: boolean;
}

const list = tv({
  base: 'columns-1 gap-8 last:-mb-2',
  variants: {
    singleColumn: {
      false: 'md:columns-2',
    },
  },
  defaultVariants: {
    singleColumn: false,
  },
});

export const ItemList: FC<ItemListProps> = ({ children, singleColumn = false }) => {
  return (
    <ul className={cn(list({ singleColumn }))}>
      {children}
    </ul>
  );
};

export interface ItemListItemProps {
  children: ReactNode[];
}

export const ItemListItem: FC<ItemListItemProps> = ({ children }) => {
  return (
    <li className="inline-flex w-full items-center justify-between mb-2 whitespace-nowrap">
      {children}
    </li>
  );
};
