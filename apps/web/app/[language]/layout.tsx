import 'server-only';

import type { ReactNode } from 'react';
import type { Language } from '@brickninja-org/database';

import { Bitter } from 'next/font/google';

import '@/styles/globals.css';

import { FormatProvider } from '@/components/format/format-context';	
import Layout from '@/components/layout/layout';
import type { Metadata, Viewport } from 'next';

const bitter = Bitter({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bitter',
});

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { language: Language };
}) {
  const { language } = params;

  return (
    <html lang={language} className={bitter.variable}>
      <head/>
      <body>
        <FormatProvider>
          <Layout language={language}>{children}</Layout>
        </FormatProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s · brick.ninja',
    default: '',
  },
  description: 'Unofficial LEGO® Database and tool collection',
  applicationName: 'brick.ninja',
  appleWebApp: {
    capable: true,
    title: 'brick.ninja',
    statusBarStyle: 'default',
  },
  formatDetection: { address: false, date: false, email: false, telephone: false, url: false },
  icons: {
    shortcut: { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};
