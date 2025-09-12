import type { FC, ReactNode } from 'react';
import type { HeroVariants } from './hero';

import { Hero } from './hero';
import { PageLayout } from '@/components/layout/PageLayout';

export interface HeroLayoutProps extends HeroVariants {
  children: ReactNode;
  hero: ReactNode;
  navbar?: ReactNode;
  toc?: boolean;
  // skipPreload?: boolean;
  skipLayout?: boolean;
}

export const HeroLayout: FC<HeroLayoutProps> = ({ children, hero, navbar, toc, color, skipLayout }) => {
  return (
    <div>
      <Hero color={color}>
        <Hero.Content>{hero}</Hero.Content>
      </Hero>
      {navbar}
      {skipLayout ? children : (
        <PageLayout toc={toc}>{children}</PageLayout>
      )}
    </div>
  );
};
