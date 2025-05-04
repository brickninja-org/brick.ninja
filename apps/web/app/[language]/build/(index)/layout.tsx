import type { ReactNode } from 'react';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { HeroLayout } from '@/components/layout/HeroLayout';

export default function BuildLayout({ children }: { children: ReactNode }) {
  return (
    <HeroLayout hero={<Headline id="builds">Builds</Headline>}>
      {children}
    </HeroLayout>
  );
}
