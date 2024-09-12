'use client';

import type { Language } from '@brickninja-org/database';
import type { EntityLinkProps } from '@/components/entity/entity-link';

import { forwardRef } from 'react';
import NextLink from 'next/link';

import { localizeName } from '@/lib/localized-name';
import { localizedUrl } from '@/lib/localized-url';

export const linkStyle = 'inline-flex items-center [justify-self:_flex-start] gap-2 overflow-hidden text-blue-600';

export const EntityLinkInternal = forwardRef<HTMLAnchorElement, EntityLinkProps>(function EntityLinkInternal({ entity, href, language, onClick, ...linkProps }: EntityLinkProps, ref) {
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
        onClick={onClick}
        {...linkProps}
      >
        <>
          <span className={linkStyle}>{localizeName(entity, language ?? defaultLanguage)}</span>
        </>
      </NextLink>
    );
  },
);
