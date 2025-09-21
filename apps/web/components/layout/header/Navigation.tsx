import type { FC, ReactNode } from 'react';
import type { Language } from '@brickninja-org/database';

import { Composite, CompositeItem } from '@brickninja-org/ui/components/focus/Composite';

import { LinkButton } from '@/components/button';
import { Translate } from '@/components/i18n/Translate';
import { HorizontalOverflowContainer } from '@/components/layout/HorizontalOverflowContainer';

interface NavigationProps {
  language: Language,
}

const Navigation: FC<NavigationProps> = ({ language }) => {
  return (
    <HorizontalOverflowContainer>
      <Composite render={<ul className="flex py-1.5 bg-background first:border-l-0"/>}>
        <NavigationItem href="/item"><Translate language={language} id="navigation.items"/></NavigationItem>
        <NavigationItem href="/sets"><Translate language={language} id="navigation.products"/></NavigationItem>
      </Composite>
    </HorizontalOverflowContainer>
  );
};

interface NavigationItemProps {
  children: ReactNode,
  href: string,
}

export const NavigationItem: FC<NavigationItemProps> = (props) => {
  return (
    <li className="border-l">
      <CompositeItem render={<LinkButton className="rounded-none font-normal" variant="ghost" {...props}/>}/>
    </li>
  );
};

export default Navigation;
