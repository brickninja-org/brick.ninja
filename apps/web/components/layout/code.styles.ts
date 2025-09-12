import type { VariantProps } from 'tailwind-variants';

import { tv } from 'tailwind-variants';

export const codeVariants = tv({
  base: 'text-sm',
  variants: {
    borderless: {
      true: '',
    },
    inline: {
      true: ''
    },
  },
  defaultVariants: {
    borderless: false,
    inline: false,
  },
  compoundVariants: [
    { borderless: false, inline: true, class: 'px-1 rounded-xs border border-default bg-content2 dark:bg-content1' }, // inlineBorder
    { borderless: true, inline: true, class: '' }, // inline
    { borderless: true, inline: false, class: 'my-4 overflow-x-auto' }, // code
    { borderless: false, inline: false, class: 'my-4 -ml-4 p-4 rounded-e-sm border border-l-0 border-default bg-content2 dark:bg-content1 overflow-x-auto' }, // codeBorder
  ],
});

export type CodeVariants = VariantProps<typeof codeVariants>;
