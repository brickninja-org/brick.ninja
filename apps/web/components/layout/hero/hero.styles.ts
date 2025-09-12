import type { VariantProps } from 'tailwind-variants';

import { tv } from 'tailwind-variants';

export const heroVariants = tv({
  slots: {
    base: '',
    content: ['relative -mt-0.25 py-8 px-4 border-b border-transparent'],
  },
  variants: {
    color: {
      blue: {
        content: ['bg-blue-800 dark:bg-blue-900 text-white'],
      },
      green: {
        content: ['bg-green-800 dark:bg-green-900 text-white'],
      },
      red: {
        content: ['bg-red-800 dark:bg-red-900 text-white'],
      },
      yellow: {
        content: ['bg-yellow-700 dark:bg-yellow-800 text-white'],
      },
    },
  },
  defaultVariants: {
    color: 'red',
  },
});

export type HeroVariants = VariantProps<typeof heroVariants>;
