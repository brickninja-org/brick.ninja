'use client';

import type { FC, ChangeEventHandler, KeyboardEventHandler, ReactElement } from 'react';
import type { TranslationSubset } from '@/lib/translate';
import type { translations as itemTypeTranslations } from '@/components/item/ItemType.translations';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { autoUpdate, offset, shift, size, useDismiss, useFloating, useFocus, useInteractions, useListNavigation } from '@floating-ui/react';

import { cn } from '@brickninja-org/ui/lib';
import { Icon } from '@brickninja-org/ui/icons';

import { useDebounce } from '@/hooks/use-debounce';
import { usePageResults, useSearchApiResults } from './use-search-results';

export interface SearchProps {
  translations: TranslationSubset<
    | 'search.placeholder'
    | 'search.results.items'
    | 'search.results.products'
    | 'search.results.product.categories'
    | 'search.results.pages'
    | typeof itemTypeTranslations.short[0]
  >;
}

export const Search: FC<SearchProps> = ({ translations }) => {
  const [ open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const searchValue = useDebounce(value, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { refs, context, x, y } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      shift({ padding: 16 }),
      size({
        apply({ rects, availableHeight, elements, availableWidth }) {
          Object.assign(elements.floating.style, {
            width: `${Math.min(availableWidth, Math.max(360, rects.reference.width))}px`,
            maxHeight: `${availableHeight}px`
          });
        },
        padding: 16
      }),
    ],
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    useFocus(context, { visibleOnly: false }),
    useDismiss(context),
    useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      virtual: true,
      loop: true,
      scrollItemIntoView: { block: 'nearest', behavior: 'smooth' },
    }),
  ]);

  const searchResults = [
    ...useSearchApiResults(searchValue, translations),
    usePageResults(searchValue),
  ];

  const loading = searchResults.some((result) => result.loading);

  let index = 0;

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setValue(e.target.value);
    setOpen(true);
  }, []);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    if(e.key === 'Enter' && activeIndex !== null) {
      const current = listRef.current[activeIndex];

      if(current === null) {
        return;
      }

      current.click();
      e.preventDefault();
    }
  }, [activeIndex]);

  // global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if(e.target instanceof HTMLElement && (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }

      if(e.key === 's' || e.key === '/' || e.code === 'Slash') {
        e.preventDefault();
        e.stopPropagation();

        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener('keypress', handler);
    return () => window.removeEventListener('keypress', handler);
  }, []);

  return (
    <form className="relative flex items-center w-[468px] bg-gray-100 focus-within:bg-background focus-within:shadow-base rounded-xs [--icon-size:20px]" ref={refs.setReference} {...getReferenceProps()}>
      <Icon icon="search" className="mr-2 ml-4 align-[-2px] shrink-0 text-gray-600"/>
      {/* <div className={styles.restriciton}>Item</div> */}

      <input
        id="search"
        ref={inputRef}
        className="flex-1 w-full py-1.5 px-2 bg-transparent focus:outline-hidden placeholder:text-muted"
        placeholder={translations['search.placeholder']}
        autoComplete="off"
        spellCheck="false"
        enterKeyHint="search"
        value={value}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}/>

      {!loading && !open && (<div className="hidden sm:inline-block absolute right-2 rounded-xs text-sm text-muted"><kbd className="py-0.25 px-0.75 rounded-xs border border-(--color-border-dark)">/</kbd> or <kbd className="py-0.25 px-0.75 rounded-xs border border-(--color-border-dark)">s</kbd></div>)}

      {loading && (open || searchValue) && <div className="block w-4 h-4 rounded-lg ml-4 mr-2 border border-transparent border-t-(--color-border) will-change-transform animate-rotate"/>}

      {open && (
        <div className="absolute top-0 left-0 w-max max-h-[calc(100vh-56px)] p-2 rounded-xs shadow-md border bg-background text-base overflow-y-auto overscroll-contain transition-opacity [scrollbar-width:thin] z-10" ref={refs.setFloating} {...getFloatingProps()} style={{
          top: y ?? 0,
          left: x ?? 0,
        }}
        >
          {searchResults.map(({ results, id }) => results.length > 0 && (
            <Fragment key={id}>
              <div className="py-2 px-4 font-medium">{translations[`search.results.${id}`]}</div>
              {results.map((result) => {
                const currentIndex = index++;
                const render = result.render ?? ((link: ReactElement) => link);

                const isExternal = result.href.startsWith('http');

                return render(
                  <NextLink
                    tabIndex={-1}
                    href={result.href}
                    key={result.href}
                    className={cn(['grid gap-x-2 gap-y-0 [grid-template-columns:32px_1fr_auto] py-2 px-4 rounded-2 text-foreground no-underline', activeIndex === currentIndex && 'bg-background-light'])}
                    id={result.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noreferrer noopener' : undefined}
                    ref={(node) => { listRef.current[currentIndex] = node; }}
                    {...getItemProps({
                      onClick: (e) => !e.defaultPrevented && setOpen(false)
                    })}
                    style={{ gridTemplateAreas: '"icon title external" "icon subtitle external"' }}
                  >
                    {result.icon}
                    <div className="[grid-area:title] line-clamp-1">
                      {result.title}
                    </div>
                    {result.subtitle && (
                      <div className="[grid-area:subtitle] text-sm text-muted">
                        {result.subtitle}
                      </div>
                    )}
                    {isExternal && <span className="[grid-area:external] ml-2 text-muted"><Icon icon="external"/></span>}
                  </NextLink>
                );
              })}
            </Fragment>
          ))}
        </div>
      )}
    </form>
  );
};
