'use client';

import type { FC, ReactNode } from 'react';
import type { Language } from '@brickninja-org/database';

import { Button, Link } from '@heroui/react';
import { Composite, CompositeItem } from '@brickninja-org/ui/components/focus/Composite';

import { Translate } from '@/components/i18n/Translate';
import { HorizontalOverflowContainer } from '@/components/layout/HorizontalOverflowContainer';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  language: Language;
}

const Navigation: FC<NavigationProps> = ({ language }) => {
  const pathname = usePathname();

  return (
    <HorizontalOverflowContainer>
      <Composite render={<ul className="flex py-1.5 bg-background first:border-l-0"/>}>
        <NavigationItem href="/item" active={pathname.startsWith('/item')}><Translate language={language} id="navigation.items"/></NavigationItem>
        <NavigationItem href="/sets" active={pathname.startsWith('/sets')}><Translate language={language} id="navigation.products"/></NavigationItem>
      </Composite>
    </HorizontalOverflowContainer>
  );
};

interface NavigationItemProps {
  children: ReactNode;
  href: string;
  active?: boolean;
}

export const NavigationItem: FC<NavigationItemProps> = ({ active = false, ...buttonProps }) => {
  return (
    <li className="border-l border-default">
      <CompositeItem
        render={(
          <Button
            as={Link}
            color={active ? 'primary' : 'default'}
            radius="sm"
            variant={active ? 'solid' : 'light'}
            {...buttonProps}/>
        )}/>
    </li>
  );
};

export default Navigation;
