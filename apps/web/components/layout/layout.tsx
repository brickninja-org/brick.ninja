import type { Language } from '@brickninja-org/database';
import type { FC, ReactNode } from 'react';

import Link from 'next/link';
import { GiNinjaHead } from 'react-icons/gi';

import { LinkButton } from '@brickninja-org/ui/components/form/button';
import { Icon } from '@brickninja-org/ui/icons';

import { translateMany } from '@/lib/translate';
import { LanguageDropdown } from '@/components/layout/header/language-dropdown';
import { Menu } from '@/components/layout/header/menu';
import Navigation from '@/components/layout/header/navigation';
import { Search } from '@/components/search/search';
import { UserButton } from '@/components/layout/header/user-button';

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
  ], language);

  return (
    <div>
      <div className="layout grid min-h-dvh">
        <Menu navigation={<Navigation language={language}/>}>
          <Link href="/" aria-label="brick.ninja" className="group relative flex items-center gap-4 mr-8 font-bitter font-bold text-xl transition-transform">
            <GiNinjaHead className="fill-red-800"/>
            <span className="hidden group-hover:underline md:block">brick.ninja</span>
          </Link>
          <Search translations={searchTranslations}/>
          <div className="flex -mr-2 ml-auto">
            <LinkButton appearance="menu" href="/review" aria-label="Review" className="gap-1 px-3" icon={<Icon icon="notepad-edit"/>}><span className="hidden md:block">Review</span></LinkButton>
            <LanguageDropdown/>
            <UserButton language={language}/>
          </div>
        </Menu>
        <hr className="[grid-area:_menuShadow] sticky block top-12 h-[1px] bg-transparent z-2"/>
        {children}
        <footer className="[grid-area:_footer] flex justify-between gap-4 flex-wrap py-8 px-4 border-t">
          <span><b className="font-bitter font-semibold">brick.ninja</b> by @brickninja &copy; {new Date().getFullYear()}</span>
          <div className="flex gap-4 flex-wrap">
            <Link className="hover:underline decoration-2 text-blue-800" href="/about">About</Link> /
            <Link className="hover:underline decoration-2 text-blue-800" href="/status">Status</Link>
          </div>
        </footer>
      </div>
      <div className="w-full p-4 border-t text-sm text-gray-600 dark:text-gray-400" data-nosnippet>
        LEGO&reg;, the LEGO&reg; logo, the Minifigure, and the Brick and Knob configurations are trademarks of the LEGO&reg; Group of Companies. &copy; {new Date().getFullYear()} The LEGO&reg; Group. brick.ninja and all content not covered by The LEGO&reg; Group&apos;s copyright is, unless otherwise stated. brick.ninja respects the LEGO&reg; Fair Play rules.
      </div>
    </div>
  );
};

export default Layout;
