'use client';

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';
import { HeroUIProvider as Provider, ToastProvider } from '@heroui/react';

import { TailwindProvider } from '@/components/tailwind/Tailwind.context';
import { useFormatContext } from '@/components/format/Format.context';

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>,
  }
}

export interface HeroUIProps {
  children: ReactNode,
}

export const HeroUIProvider = ({ children }: HeroUIProps) => {
  const router = useRouter();
  const { locale } = useFormatContext();

  const supportedLocaleValues = [
    'fr-FR', 'fr-CA', 'de-DE', 'en-US', 'en-GB', 'ja-JP',
    'da-DK', 'nl-NL', 'fi-FI', 'it-IT', 'nb-NO', 'es-ES',
    'sv-SE', 'pt-BR', 'zh-CN', 'zh-TW', 'ko-KR', 'bg-BG',
    'hr-HR', 'cs-CZ', 'et-EE', 'hu-HU', 'lv-LV', 'lt-LT',
    'pl-PL', 'ro-RO', 'ru-RU', 'sr-SP', 'sk-SK', 'sl-SI',
    'tr-TR', 'uk-UA', 'ar-AE', 'ar-DZ', 'AR-EG', 'ar-SA',
    'el-GR', 'he-IL', 'fa-AF', 'am-ET', 'hi-IN', 'th-TH'
  ];

  return (
    <TailwindProvider>
      <Provider navigate={router.push} locale={supportedLocaleValues.includes(locale) ? locale : 'en-US'}>
        <ToastProvider/>
        {children}
      </Provider>
    </TailwindProvider>
  );
};
