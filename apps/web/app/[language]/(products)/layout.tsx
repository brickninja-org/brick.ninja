import type { LayoutProps } from '@/lib/next';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { createMetadata } from '@/lib/metadata';
import { translate } from '@/lib/translate';
import { Translate } from '@/components/i18n/Translate';
import { HeroLayout } from '@/components/layout/HeroLayout';
import { Navbar } from '@/components/layout/Navbar';

export default function CatalogLayout({ children }: LayoutProps) {
  return (
    <HeroLayout
      color="blue"
      hero={<Headline id="catalog"><Translate id="navigation.products"/></Headline>}
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

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;

  return {
    title: {
      template: `${translate('navigation.catalog', language)}: %s · brick-catalog.eu`,
      default: '',
    },
  };
});
