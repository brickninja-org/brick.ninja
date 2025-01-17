'use client';

import type { FC } from 'react';
import type { EntityLinkProps } from '@/components/entity/EntityLink';

import NextLink from 'next/link';

import { cn } from '@brickninja-org/ui/lib';

import { localizedName } from '@/lib/localized-name';
import { localizedUrl } from '@/lib/localized-url';
import { useLanguage } from '@/components/i18n/context';

export const EntityLinkInternal: FC<EntityLinkProps> = ({ ref, className, entity, href, language, onClick, ...linkProps }) => {
  const defaultLanguage = useLanguage();

  if (language && defaultLanguage !== language) {
    href = localizedUrl(href, language);
  }

  return (
    <NextLink
      suppressHydrationWarning
      key={href}
      ref={ref}
      href={href}
      hrefLang={language}
      className={cn([
        'inline-flex',
        'items-center',
        '[justify-self:_flex-start]',
        'gap-2',
        'overflow-hidden',
        'text-blue-600',
        '[&>span]:hover:decoration-black',
      ], className)}
      onClick={onClick}
      {...linkProps}
    >
      <>
        <span className="py-0.5 overflow-hidden text-ellipsis underline underline-offset-2 decoration-2 decoration-transparent">{localizedName(entity, language ?? defaultLanguage)}</span>
      </>
    </NextLink>
  );
};
