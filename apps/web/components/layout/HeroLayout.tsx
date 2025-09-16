import type { FC, ReactNode } from 'react';
import type { VariantProps } from '@heroui/react';

import { tv } from '@heroui/react';

import { PageLayout } from '@/components/layout/PageLayout';

export interface HeroLayoutProps extends HeroVariants {
  children: ReactNode,
  hero: ReactNode,
  navbar?: ReactNode,
  toc?: boolean,
  // skipPreload?: boolean;
  skipLayout?: boolean,
}

const styles = tv({
  base: 'relative -mt-0.25 py-8 px-4 border-b border-transparent',
  variants: {
    color: {
      blue: 'bg-blue-800 text-white',
      green: 'bg-green-800 text-white',
      red: 'bg-red-800 text-white',
      yellow: 'bg-yellow-600 text-white',
    },
  },
  defaultVariants: {
    color: 'red'
  },
});

type HeroVariants = VariantProps<typeof styles>;

export const HeroLayout: FC<HeroLayoutProps> = ({ children, hero, navbar, toc, color, skipLayout }) => {
  return (
    <div>
      <div className={styles({ color })}>{hero}</div>
      {navbar}
      {skipLayout ? children : (
        <PageLayout toc={toc}>{children}</PageLayout>
      )}
    </div>
  );
};
