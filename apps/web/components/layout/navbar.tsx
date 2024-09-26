'use client';

import type { FC, ReactNode } from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';
import { Composite, CompositeItem } from '@floating-ui/react';

import { LinkButton } from '@brickninja-org/ui/components/form/button';
import { tv } from 'tailwind-variants';

interface NavbarProps {
  items: { label: ReactNode, segment: string }[];
  path?: '/' | `/${string}/`;
}

const nav = tv({
  slots: {
    base: '-mt-4 mb-4 -mx-4 bg-gray-100 shadow-inner shadow-gray-200',
    list: 'inline-flex items-start gap-2 mx-4 pt-2 list-none',
    button: 'block m-0 pb-2 rounded-t-sm border border-b-0 border-transparent',
    link: 'hover:[&:not(:disabled)]:bg-gray-200',
  },
  variants: {
    active: {
      true: {
        button: 'border-gray-300 border-b-white bg-white',
        link: '!shadow-none hover:[&:not(:disabled)]:bg-transparent',
      },
    },
  },
});

export const Navbar: FC<NavbarProps> = ({ items, path = '/' }) => {
  const segment = useSelectedLayoutSegments().join('/');

  const { base, list, button, link } = nav({ active: segment === '' });

  return (
    <div className={base()}>
      <Composite render={<ul className={list()}/>}>
        {items.map((item) => (
          <li key={item.segment} className={button({ active: segment === item.segment })}>
            <CompositeItem render={<LinkButton href={`${path}${item.segment}`} appearance="menu" className={link({ active: segment === item.segment })}/>}>
              {item.label}
            </CompositeItem>
          </li>
        ))}
      </Composite>
    </div>
  );
};
