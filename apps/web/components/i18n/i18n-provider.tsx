import 'server-only';

import { type FC, type ReactNode } from 'react';

import type { Language } from '@brickninja-org/database';

import { I18nProvider as ContextProvider } from '@/components/i18n/context';

export interface I18nProviderProps {
  children: ReactNode;
  language: Language;
}

export const I18nProvider: FC<I18nProviderProps> = ({ children, language }) => {
  return (
    <ContextProvider language={language}>{children}</ContextProvider>
  );
};
