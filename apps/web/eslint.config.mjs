import { defineConfig, globalIgnores } from 'eslint/config';
import nextConfig from '@next/eslint-plugin-next';
import reactCompiler from 'eslint-plugin-react-compiler';

import reactConfig from '@brickninja-org/eslint-config/react';

export default defineConfig(
  // ignore Next.js generated files
  globalIgnores([
    '.next/',
    'next-env.d.ts'
  ]),

  // extends next/core-web-vitals
  nextConfig.flatConfig.coreWebVitals,

  // extend @brickninja-org/eslint-config/react
  ...reactConfig,

  // enable enable react-compiler plugin (no flat preset yet)
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: reactCompiler.configs.recommended.rules
  },
  
  // enable @brickninja-org/nextjs plugin for page.tsx files (no flat preset yet)
  // nextJsPlugin.configs.recommended,
);
