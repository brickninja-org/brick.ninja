import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Pick<Config, 'darkMode' | 'plugins' | 'presets'> = {
  darkMode: 'class',
  plugins: [nextui({})],
};

export default config;
