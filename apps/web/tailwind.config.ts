import type { Config } from 'tailwindcss';

import nextUIConfig from '@brickninja-org/ui/tailwind.config';

const config: Partial<Config> = {
  presets: [nextUIConfig],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../node_modules/@brickninja-org/ui/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      featureSettings: {
        DEFAULT: '"tnum" 1',
      },
      fontFamily: {
        bitter: ['var(--font-bitter)'],
      },
      animation: {
        'rotate': 'rotate infinity 1s cubic-bezier(0.5, 0.25, 0.5, 0.75)',
        'slide-in': 'slide-in .1s ease-out',
      },
      boxShadow: {
        DEFAULT: '0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)',
        focus: 'inset 0 0 0 2px #245dc1',
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0)' },
          '100%': { transform: 'rotate(1turn)' },
        },
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
