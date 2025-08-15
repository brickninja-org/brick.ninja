import type { Language } from '@brickninja-org/database';
import type { FC, ReactNode } from 'react';

import Link from 'next/link';
import { GiNinjaHead } from 'react-icons/gi';

import { translateMany } from '@/lib/translate';
import { LanguageDropdown } from '@/components/layout/header/LanguageDropdown';
import { Menu } from '@/components/layout/header/Menu';
import Navigation from '@/components/layout/header/Navigation';
import { translations as itemTypeTranslations } from '@/components/item/ItemType.translations';
import { Search } from '@/components/search/Search';
import { ReviewButton } from '@/components/layout/header/ReviewButton';
import { UserButton } from '@/components/layout/header/UserButton';

import './layout.css';

interface LayoutProps {
  children: ReactNode;
  language: Language;
}

const Layout: FC<LayoutProps> = ({ children, language }) => {
  const searchTranslations = translateMany([
    'search.placeholder',
    'search.results.items',
    'search.results.pages',
    'search.results.products',
    'search.results.product.categories',
    ...itemTypeTranslations.short,
  ], language);

  const languageTranslations = translateMany([
    'locale.formatting.settings',
    'language.select.label',
    'language.select.placeholder',
    'region.select.label',
    'region.select.placeholder',
  ], language);

  return (
    <div>
      <div className="layout grid min-h-dvh">
        <Menu navigation={<Navigation language={language}/>}>
          <Link href="/" aria-label="brick-catlog.eu" className="group relative flex items-center gap-4 mr-8 font-bitter font-bold text-xl text-foreground no-underline transition-transform">
            <GiNinjaHead className="fill-red-800"/>
            <span className="hidden group-hover:underline md:block">brick-catalog.eu</span>
          </Link>
          <Search translations={searchTranslations}/>
          <div className="flex -mr-2 ml-auto">
            <ReviewButton language={language}/>
            <LanguageDropdown translations={languageTranslations}/>
            <UserButton language={language}/>
          </div>
        </Menu>
        <hr className="[grid-area:menuShadow] sticky block top-12 h-[1px] bg-transparent z-2"/>
        {children}
        <footer className="[grid-area:footer] flex justify-between gap-4 flex-wrap py-8 px-4 border-t border-(--color-border)">
          <span><b className="font-bitter font-semibold">brick-catalog.eu</b> by @brickninja &copy; {new Date().getFullYear()}</span>
          <div className="flex gap-4 flex-wrap">
            <Link href="/about">About</Link> /
            <Link href="/legal/legal-notice">Legal Notice</Link> /
            <Link href="/legal/privacy-policy">Privacy Policy</Link> /
            <Link href="/status">Status</Link>
          </div>
        </footer>
      </div>
      <div className="w-full p-4 border-t border-(--color-border) text-sm text-muted" data-nosnippet>
        LEGO&reg;, the LEGO&reg; logo, the Minifigure, and the Brick and Knob configurations are trademarks of the LEGO&reg; Group of Companies. &copy; {new Date().getFullYear()} The LEGO&reg; Group. brick.ninja and all content not covered by The LEGO&reg; Group&apos;s copyright is, unless otherwise stated. brick.ninja respects the LEGO&reg; Fair Play rules.
      </div>
    </div>
  );
};

export default Layout;
