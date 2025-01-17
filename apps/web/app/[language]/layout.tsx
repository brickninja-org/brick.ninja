import 'server-only';

import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import type { LayoutProps } from '@/lib/next';

import './globals.css';
import { Bitter } from 'next/font/google';

import { cn } from '@brickninja-org/ui/lib';
import { DataTableContext } from '@brickninja-org/ui/components/table/DataTable.context';

import { FormatProvider } from '@/components/format/Format.context';
import { I18nProvider } from '@/components/i18n/I18nProvider';	
import { ItemTableContext } from '@/components/item-table/ItemTable.context';
import Layout from '@/components/layout/Layout';

const bitter = Bitter({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bitter',
});

export default async function RootLayout({ children, params }: LayoutProps & { modal?: ReactNode }) {
  const { language } = await params;

  return (
    <html lang={language} className={cn(bitter.variable)}>
      <head/>
      <body>
        <I18nProvider language={language}>
          <FormatProvider>
            <ItemTableContext global id="global">
              <DataTableContext>
                <Layout language={language}>{children}</Layout>
              </DataTableContext>
            </ItemTableContext>
          </FormatProvider>
        </I18nProvider>
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
