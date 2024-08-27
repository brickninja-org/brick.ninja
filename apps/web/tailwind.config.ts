import type { Config } from 'tailwindcss';

import nextUIConfig from '@brickninja-org/ui/tailwind.config';

const config: Partial<Config> = {
  presets: [nextUIConfig],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bitter: ['var(--font-bitter)'],
      },
      animation: {
        'slide-in': 'slide-in .1s ease-out',
      },
      keyframes: {
        'slide-in': {
          '0%': {
            transform: 'translateY(-48px)',
          },
        },
      }
    },
  },
};

export default config;
