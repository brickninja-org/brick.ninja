import type { VariantProps } from 'tailwind-variants';

import { tv } from 'tailwind-variants';

export const flexRowVariants = tv({
  base: ['flex gap-2 items-center not-first:mt-4'],
  variants: {
    align: {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
    },
    inline: {
      true: 'inline-flex',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    align: 'start',
    inline: false,
    wrap: false,
  },
});

export type FlexRowVariants = VariantProps<typeof flexRowVariants>;
