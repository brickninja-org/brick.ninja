import type { FC, ReactNode } from 'react';

import { tv } from 'tailwind-variants';

interface ListProps {
  children: ReactNode,
  numbered?: boolean,
}

const list = tv({
  base: 'my-2 pl-0 list-disc',
  variants: {
    numbered: {
      true: 'p-6 list-decimal',
    }
  },
});

export const List: FC<ListProps> = ({ children, numbered }) => {
  const Tag = numbered ? 'ol' : 'ul';

  return (
    <Tag className={list({ numbered })}>
      {children}
    </Tag>
  );
};
