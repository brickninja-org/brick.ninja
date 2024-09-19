import type { Config } from 'tailwindcss';

const config: Pick<Config, 'darkMode' | 'plugins' | 'presets'> = {
  darkMode: 'class',
  presets: [
    {
      theme: {
        extend: {
          colors: {
            'border-default': 'var(--color-border)',
          }
        }
      }
    }
  ]
};

export default config;
