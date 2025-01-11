import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactCompiler from 'eslint-plugin-react-compiler';

const compat = new FlatCompat({
  baseDirectory: import.meta.url,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default tseslint.config(
  { ignores: ['.next'] },
  ...compat.extends('next/core-web-vitals', '@brickninja-org/eslint-config/react'),
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
  },
  {
    files: ['eslint.config.mjs'],
    // eslint-disable-next-line import/no-named-as-default-member
    extends: [tseslint.configs.disableTypeChecked],
  },
);
