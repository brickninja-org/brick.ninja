import type { FC, ReactNode } from 'react';

import type { Language } from '@brickninja-org/database';
import { LinkButton } from '@brickninja-org/ui/components/form/button';
import { Composite, CompositeItem } from '@brickninja-org/ui/components/focus/composite';
import { Translate } from '@/components/i18n/translate';

interface NavigationProps {
  language: Language;
}

const Navigation: FC<NavigationProps> = ({ language }) => {
  return (
    <div className="relative overflow-hidden bg-white border-b">
      <Composite render={<ul className="flex m-0 py-1.5 first:border-l-0"/>}>
        <NavigationItem href="/item"><Translate language={language} id="navigation.items"/></NavigationItem>
        <NavigationItem href="/catalog/book"><Translate language={language} id="navigation.catalog"/></NavigationItem>
      </Composite>
    </div>
  );
};

interface NavigationItemProps {
  children: ReactNode;
  href: string;
}

export const NavigationItem: FC<NavigationItemProps> = (props) => {
  return (
    <li className="border-l">
      <CompositeItem render={<LinkButton appearance="menu" {...props}/>}/>
    </li>
  );
};

export default Navigation;
