import type { Language } from '@brickninja-org/database';
import type { FC, ReactNode } from 'react';

import './layout.css';

import Link from 'next/link';
import { GiNinjaHead } from 'react-icons/gi';

import { Menu } from './header/menu';
import Navigation from './header/navigation';

interface LayoutProps {
  children: ReactNode;
  language: Language;
}

const Layout: FC<LayoutProps> = ({ children, language }) => {
  return (
    <div>
      <div className="layout grid min-h-[100dvh]">
        <Menu navigation={<Navigation language={language}/>}>
          <Link href="/" aria-label="brick.ninja" className="group relative flex items-center gap-4 mr-8 font-bitter font-bold text-xl [transition:_transform_.3s_ease]">
            <GiNinjaHead fill="#991b1b"/>
            <span className="group-hover:underline">brick.ninja</span>
          </Link>
          <div className="flex -mr-2 ml-auto">
            Right
          </div>
        </Menu>
        <hr className="[grid-area:_menuShadow] sticky block top-12 h-[1px] bg-transparent z-[2]"/>
        {children}
        <footer className="[grid-area:_footer] flex justify-between gap-4 flex-wrap py-8 px-4 border-t">
          <span><strong>brick.ninja</strong> by @brickninja &copy; {new Date().getFullYear()}</span>
          <div className="flex gap-4 flex-wrap">
            <Link href="/about">About</Link>
            <Link href="/status">Status</Link>
          </div>
        </footer>
      </div>
      <div className="w-full p-4 border-t text-sm" data-nosnippet>
        LEGO&reg;, the LEGO&reg; logo, the Minifigure, and the Brick and Knob configurations are trademarks of the LEGO&reg; Group of Companies. &copy; {new Date().getFullYear()} The LEGO&reg; Group. brick.ninja and all content not covered by The LEGO&reg; Group&apos;s copyright is, unless otherwise stated. brick.ninja respects the LEGO&reg; Fair Play rules.
      </div>
    </div>
  );
};

export default Layout;
