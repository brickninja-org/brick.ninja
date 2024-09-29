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
        { label: 'Sets', segment: 'set' },
        { label: 'Books', segment: 'book' },
      ]}/>
      <div>
        {children}
      </div>
    </HeroLayout>
  );
}

export function generateMetadata({ params }: LayoutProps): Metadata {
  return {
    title: {
      template: `${translate('navigation.catalog', params.language)}: %s`,
      default: '',
    },
  };
}
