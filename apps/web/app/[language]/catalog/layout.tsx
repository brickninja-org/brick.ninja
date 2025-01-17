import type { Metadata } from 'next';
import type { LayoutProps } from '@/lib/next';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { translate } from '@/lib/translate';
import { Badge } from '@/components/badge/Badge';
import { Translate } from '@/components/i18n/Translate';
import { HeroLayout } from '@/components/layout/HeroLayout';
import { Navbar } from '@/components/layout/Navbar';

export default function CatalogLayout({ children }: LayoutProps) {
  return (
    <HeroLayout color="yellow" hero={<Headline id="catalog"><Translate id="navigation.catalog"/></Headline>}>
      <Navbar path="/catalog/" items={[
        { segment: 'sets', label: <><Translate id="catalog.sets"/><Badge>New</Badge></> },
        { segment: 'books', label: <Translate id="catalog.books"/> },
      ]}/>
      <div>
        {children}
      </div>
    </HeroLayout>
  );
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: {
      template: `${translate('navigation.catalog', language)}: %s`,
      default: '',
    },
  };
}
