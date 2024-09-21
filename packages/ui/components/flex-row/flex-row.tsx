import type { FC, ReactNode } from 'react';

import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '../../lib';

const flex = tv({
  base: 'flex gap-2 [&:not(:first-child)]:mt-4 items-center',
  variants: {
    align: {
      left: 'justify-start',
      right: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
    },
    wrap: {
      false: 'flex-nowrap',
      true: 'flex-wrap',
    },
  },
  defaultVariants: {
    align: 'left',
    wrap: false,
  },
});

export type FlexVariants = VariantProps<typeof flex>;

interface FlexRowProps extends FlexVariants {
  className?: string;
  children: ReactNode;
}

export const FlexRow: FC<FlexRowProps> = (props) => {
  const { children, className, align, wrap } = props;

  return <div className={cn(flex({ align, wrap }), className)}>{children}</div>;
};
