'use client';

import type { Language } from '@brickninja-org/database';
import type { EntityLinkProps } from '@/components/entity/entity-link';

import { forwardRef } from 'react';
import NextLink from 'next/link';

import { localizeName } from '@/lib/localized-name';
import { localizedUrl } from '@/lib/localized-url';
import { cn } from '@brickninja-org/ui/lib';

export const EntityLinkInternal = forwardRef<HTMLAnchorElement, EntityLinkProps>(function EntityLinkInternal({ className, entity, href, language, onClick, ...linkProps }: EntityLinkProps, ref) {
    const defaultLanguage = 'en' as Language;

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
          'hover:[&>span]:decoration-black',
        ], className)}
        onClick={onClick}
        {...linkProps}
      >
        <>
          <span className="py-0.5 overflow-hidden text-ellipsis underline underline-offset-2 decoration-2 decoration-transparent">{localizeName(entity, language ?? defaultLanguage)}</span>
        </>
      </NextLink>
    );
  },
);
