import type { FC, ReactElement, ReactNode } from 'react';

import { Children } from 'react';
import NextLink from 'next/link';

import { isTruthy, type Falsy } from '@brickninja-org/helper/is';

import { absoluteUrl } from '@/lib/url';

export interface BreadcrumbProps {
  children: (ReactElement<BreadcrumbItemProps, typeof BreadcrumbItem> | Falsy)[];
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ children }) => {
  return (
    <ol className="flex items-baseline gap-2 flex-wrap text-gray-800 whitespace-nowrap [&>li:nth-child(n+2)]:before:[content:_'>'] [&>li:nth-child(n+2)]:before:inline-block [&>li:nth-child(n+2)]:before:mr-2">
      {Children.map(children, (child) => isTruthy(child) && (
        <li>{child}</li>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: children.filter(isTruthy).map(({ props: { name, href }}, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            // eslint-disable-next-line object-shorthand
            'name': name,
            'item': href ? absoluteUrl(href) : undefined,
          })),
        }),
      }}/>
    </ol>
  );
};

interface BreadcrumbItemProps {
  name: string;
  href?: string;
  children?: ReactNode;
}

export const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ name, href, children }) => {
  return children ?? (href ? <NextLink className="underline underline-offset-2 decoration-2 decoration-transparent hover:decoration-black" href={href}>{name}</NextLink> : name);
};
