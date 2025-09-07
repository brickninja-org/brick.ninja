'use client';

import type { FC, ChangeEventHandler, KeyboardEventHandler, ReactElement, FormEventHandler } from 'react';
import type { TranslationSubset } from '@/lib/translate';
import type { translations as itemTypeTranslations } from '@/components/item/ItemType.translations';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { autoUpdate, offset, shift, size, useDismiss, useFloating, useFocus, useInteractions, useListNavigation } from '@floating-ui/react';
import { cn, Form, Input, Kbd, Link, Spinner } from '@heroui/react';

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
    if(e.key === 'Enter') {
      // get active element, fallback to first element
      const current = listRef.current.length > 0
        ? listRef.current[activeIndex ?? 0]
        : null;

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

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    // prevent form submission
    e.preventDefault();
  }, []);

  const endContent = !loading
    ? !open && (
      <div className="hidden sm:inline-flex gap-1.5">
        <Kbd keys={[]}>/</Kbd> or <Kbd keys={[]}>s</Kbd>
      </div>
    ) : (open || searchValue) && <Spinner size="sm" variant="dots"/>;

  return (
    <Form className="relative flex items-center w-[468px] focus-within:bg-background focus-within:shadow-base rounded-xs [--icon-size:20px]" ref={refs.setReference} {...getReferenceProps()} onSubmit={handleSubmit}>
      <Input
        fullWidth
        aria-label="Search"
        autoComplete="off"
        classNames={{
          base: 'text-default-400',
          // inputWrapper: 'bg-content2 dark:bg-content1',
        }}
        endContent={endContent}
        enterKeyHint="search"
        id="search"
        placeholder={translations['search.placeholder']}
        radius="sm"
        ref={inputRef}
        spellCheck="false"
        startContent={<Icon className="text-default-400" icon="search"/>}
        value={value}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}/>

      {open && (
        <div className="absolute top-6 left-0 w-max max-h-[calc(100vh-56px)] p-2 rounded-xs shadow-md border bg-background text-base overflow-y-auto overscroll-contain transition-opacity [scrollbar-width:thin] z-10" ref={refs.setFloating} {...getFloatingProps()} style={{
          top: (y ?? 0) + 48,
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
                  <Link
                    tabIndex={-1}
                    href={result.href}
                    key={result.href}
                    className={cn(['grid gap-x-2 gap-y-0 grid-cols-[32px_1fr_auto] py-2 px-4 rounded-2 text-foreground', activeIndex === currentIndex && 'bg-background-light'])}
                    id={result.href}
                    ref={(node) => { listRef.current[currentIndex] = node; }}
                    {...getItemProps({
                      onClick: (e) => !e.defaultPrevented && setOpen(false)
                    })}
                    isBlock
                    isExternal={isExternal}
                    underline="none"
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
                  </Link>
                );
              })}
            </Fragment>
          ))}
        </div>
      )}
    </Form>
  );
};
