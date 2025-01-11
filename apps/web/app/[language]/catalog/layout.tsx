import { Badge } from '@/components/badge/badge';
import { Translate } from '@/components/i18n/translate';
import { HeroLayout } from '@/components/layout/hero-layout';
import { Navbar } from '@/components/layout/navbar';
import type { LayoutProps } from '@/lib/next';
import { translate } from '@/lib/translate';
import { Headline } from '@brickninja-org/ui/components/headline';
import type { Metadata } from 'next';

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
