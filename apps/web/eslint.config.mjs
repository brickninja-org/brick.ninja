import nextConfig from '@next/eslint-plugin-next';
import reactConfig from '@brickninja-org/eslint-config/react';
import reactCompiler from 'eslint-plugin-react-compiler';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // ignore all files in .next
  { ignores: ['.next'] },

  // extends next/core-web-vitals
  nextConfig.flatConfig.coreWebVitals,

  // extend @gw2treasures/eslint-config/react
  ...reactConfig,

  // enable enable react-compiler plugin (no flat preset yet)
  {
    plugins: { 'react-compiler': reactCompiler },
    rules: reactCompiler.configs.recommended.rules
  },
  
  // enable @brickninja-org/nextjs plugin for page.tsx files (no flat preset yet)
  // nextJsPlugin.configs.recommended,
);
