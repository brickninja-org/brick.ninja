import { cn } from '@brickninja-org/ui/lib';
import { type FC, type ReactNode } from 'react';
import { tv } from 'tailwind-variants';

export interface ItemListProps {
  children: ReactNode[];
  singleColumn?: boolean;
}

const list = tv({
  base: 'm-0 p-0 list-none columns-1 gap-8',
  variants: {
    singleColumn: {
      false: 'md:columns-2',
    },
  },
  defaultVariants: {
    singleColumn: false,
  },
});

export const ItemList: FC<ItemListProps> = ({ children, singleColumn }) => {
  return (
    <ul className={cn(list({ singleColumn }))}>
      {children}
    </ul>
  );
};
