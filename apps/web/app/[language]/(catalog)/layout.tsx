import type { Metadata } from 'next';
import type { LayoutProps } from '@/lib/next';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { translate as t } from '@/lib/translate';
import { Translate } from '@/components/i18n/Translate';
import { HeroLayout } from '@/components/layout/HeroLayout';
import { Navbar } from '@/components/layout/Navbar';

export default function CatalogLayout({ children }: LayoutProps) {
  return (
    <HeroLayout
      color="blue"
      hero={<Headline id="catalog"><Translate id="navigation.catalog"/></Headline>}
      navbar={(
        <Navbar
          path="/"
          items={[
            { segment: 'sets', icon: 'decoration', label: <Translate id="navigation.sets"/> },
            { segment: 'gear', icon: 'settings', label: <Translate id="navigation.gear"/> },
            { segment: 'books', icon: 'notepad-edit', label: <Translate id="navigation.books"/> },
          ]}/>
      )}
    >
      {children}
    </HeroLayout>
  );
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: {
      template: `${t('navigation.catalog', language)}: %s · brick.ninja`,
      default: '',
    },
  };
}
