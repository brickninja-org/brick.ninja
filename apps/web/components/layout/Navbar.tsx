'use client';

import type { FC, ReactNode } from 'react';
import type { IconProp } from '@brickninja-org/ui/icons';

import { useSelectedLayoutSegments } from 'next/navigation';
import { Composite, CompositeItem } from '@floating-ui/react';
import { tv } from 'tailwind-variants';

import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { HorizontalOverflowContainer } from './HorizontalOverflowContainer';

interface NavbarProps {
  items: { label: ReactNode, segment: string, href?: string, icon?: IconProp }[];
  path?: '/' | `/${string}/`;
}

const nav = tv({
  slots: {
    base: 'bg-background-light shadow-[inset_0_-1px_0_0] shadow-gray-200',
    list: 'inline-flex items-start gap-2 mx-4 pt-2 list-none',
    button: 'block m-0 pb-2 rounded-t-sm border border-b-0 border-transparent',
    link: 'hover:not-disabled:bg-gray-200',
  },
  variants: {
    active: {
      true: {
        button: 'border-gray-300 border-b-white bg-white',
        link: 'shadow-none! hover:not-disabled:bg-transparent',
      },
    },
  },
});

export const Navbar: FC<NavbarProps> = ({ items, path = '/' }) => {
  const segment = useSelectedLayoutSegments().join('/');

  const { base, list, button, link } = nav({ active: segment === '' });

  return (
    <div className={base()}>
      <HorizontalOverflowContainer inverted>
        <Composite render={<ul className={list()}/>}>
          {items.map((item) => (
            <li key={item.segment} className={button({ active: segment === item.segment })}>
              <CompositeItem render={<LinkButton href={item.href ?? (path + item.segment)} appearance="menu" className={link({ active: segment === item.segment })} icon={item.icon}/>}>
                <span>
                  {item.label}
                </span>
              </CompositeItem>
            </li>
          ))}
        </Composite>
      </HorizontalOverflowContainer>
    </div>
  );
};
