'use client';

import type { FC, ReactNode } from 'react';

import { useEffect, useState } from 'react';
import { cn } from '@heroui/react';
import { Icon } from '@brickninja-org/ui/icons';

export interface MenuProps {
  children: ReactNode,
  navigation: ReactNode,
}

export const Menu: FC<MenuProps> = ({ children, navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState('window' in global && window.scrollY > 0);

  useEffect(() => {
    const listener = () => {
      setScrolledDown(window.scrollY > 0);
    };

    window.addEventListener('scroll', listener, { passive: true });

    return () => window.removeEventListener('scroll', listener);
  }, []);

  useEffect(() => {
    if (!scrolledDown && menuOpen) {
      setMenuOpen(false);
    }
  }, [scrolledDown, menuOpen]);

  return (
    <div className="[grid-area:_menu]">
      <header
        className={cn([
          'fixed top-0 inset-x-0',
          'flex items-center gap-4 md:gap-8',
          'h-12 px-4',
          'bg-background',
          'z-10',
          scrolledDown && '[&>a]:translate-x-8',
        ])}
        suppressHydrationWarning
      >
        <button
          className={cn([
            'absolute',
            'h-12 w-12',
            '-mx-4',
            'bg-transparent',
            'opacity-0 [transition:_opacity_.1s_ease] delay-0',
            'cursor-pointer pointer-events-none',
            scrolledDown && 'opacity-100 delay-150 pointer-events-auto',
          ])}
          onClick={() => setMenuOpen(!menuOpen)}
          tabIndex={-1}
          aria-label="Menu"
        >
          <Icon icon="navigation"/>
        </button>
        {children}
      </header>

      <nav
        className={cn([
          'absolute left-0 right-0 mt-12 z-9',
          menuOpen && 'fixed border-b border-transparent animate-slide-in',
        ])}
      >
        {navigation}
      </nav>
    </div>
  );
};
