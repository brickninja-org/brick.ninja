import type { VariantProps } from 'tailwind-variants';

import { tv } from 'tailwind-variants';

export const itemListVariants = tv({
  slots: {
    base: 'columns-1 gap-8 last:-mb-2',
    item: 'inline-flex w-full items-center justify-between mb-2 whitespace-nowrap',
  },
  variants: {
    singleColumn: {
      false: {
        base: 'md:columns-2',
      },
    },
  },
  defaultVariants: {
    singleColumn: false,
  },
});

export type ItemListVariants = VariantProps<typeof itemListVariants>;
