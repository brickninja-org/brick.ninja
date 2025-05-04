import 'server-only';

import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import type { LayoutProps } from '@/lib/next';

import './globals.css';
import { Bitter } from 'next/font/google';

import { cn } from '@brickninja-org/ui/lib';
import { DataTableContext } from '@brickninja-org/ui/components/table/DataTable.context';

import { client_id } from '@/lib/bn2me';
import { Bn2MeProvider } from '@/components/bn2me/Bn2Me.context';
import { FormatProvider } from '@/components/format/Format.context';
import { I18nProvider } from '@/components/i18n/I18nProvider';
import { ItemTableContext } from '@/components/item-table/ItemTable.context';
import Layout from '@/components/layout/Layout';
import { UserProvider } from '@/components/user/UserProvider';
import { Bn2APIProvider } from '@/components/bn2-api/Bn2APIProvider';

const bitter = Bitter({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bitter',
});

export default async function RootLayout({ children, modal, params }: LayoutProps & { modal?: ReactNode }) {
  const { language } = await params;

  return (
    <html lang={language} className={cn(bitter.variable)}>
      <head/>
      <body>
        <I18nProvider language={language}>
          <FormatProvider>
            <ItemTableContext global id="global">
              <DataTableContext>
                <UserProvider>
                  <Bn2MeProvider clientId={client_id} baseUrl={process.env.BN2ME_URL}>
                    <Bn2APIProvider>
                      <Layout language={language}>{children}</Layout>
                      {modal}
                    </Bn2APIProvider>
                  </Bn2MeProvider>
                </UserProvider>
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
  keywords: ['lego', 'brick', 'part', 'element', 'set', 'minifigure', 'collection'],
  manifest: '/site.webmanifest',
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
