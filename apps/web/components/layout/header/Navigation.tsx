import type { FC, ReactNode } from 'react';
import type { Language } from '@brickninja-org/database';

import { Button, Link } from '@heroui/react';
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
        <NavigationItem href="/sets"><Translate language={language} id="navigation.products"/></NavigationItem>
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
    <li className="border-l border-default">
      <CompositeItem
        render={(
          <Button
            as={Link}
            color="default"
            radius="sm"
            variant="light"
            {...props}/>
        )}/>
    </li>
  );
};

export default Navigation;
