import type { FC, ReactNode } from 'react';
import type { Language } from '@brickninja-org/database';

import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Composite, CompositeItem } from '@brickninja-org/ui/components/focus/Composite';

import { Translate } from '@/components/i18n/Translate';
import { HorizontalOverflowContainer } from '@/components/layout/HorizontalOverflowContainer';

interface NavigationProps {
  language: Language;
}

const Navigation: FC<NavigationProps> = ({ language }) => {
  return (
    <HorizontalOverflowContainer>
      <Composite render={<ul className="flex py-1.5 bg-background first:border-l-0"/>}>
        <NavigationItem href="/item"><Translate language={language} id="navigation.items"/></NavigationItem>
        <NavigationItem href="/sets"><Translate language={language} id="navigation.catalog"/></NavigationItem>
      </Composite>
    </HorizontalOverflowContainer>
  );
};

interface NavigationItemProps {
  children: ReactNode;
  href: string;
}

export const NavigationItem: FC<NavigationItemProps> = (props) => {
  return (
    <li className="border-l border-(--color-border)">
      <CompositeItem render={<LinkButton appearance="menu" {...props}/>}/>
    </li>
  );
};

export default Navigation;
