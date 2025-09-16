'use client';

import type { FC, MouseEventHandler, ReactNode } from 'react';

import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';

type Anchor = {
  id: string,
  element: HTMLElement,
  label: ReactNode,
};

type Context = {
  anchors: Anchor[],
  registerAnchor: (anchor: Anchor) => () => void,
};

const Context = createContext<Context>({
  anchors: [],
  registerAnchor: () => () => {},
});

export interface TableOfContentContextProps {
  children: ReactNode,
}

type Action = {
  type: 'register',
  anchor: Anchor,
} | {
  type: 'unregister',
  anchor: Anchor,
};

export const TableOfContentContext: FC<TableOfContentContextProps> = ({ children }) => {
  const [anchors, updateAnchors] = useReducer((state: Anchor[], action: Action): Anchor[] => {
    switch (action.type) {
      case 'register':
        return [...state, action.anchor].sort((a, b) => a.element.compareDocumentPosition(b.element) === Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
      case 'unregister':
        return state.filter((anchor) => anchor !== action.anchor);
      default:
        throw new Error();
    }
  }, []);

  const registerAnchor = useCallback((anchor: Anchor) => {
    updateAnchors({ type: 'register', anchor });

    return () => updateAnchors({ type: 'unregister', anchor });
  }, [updateAnchors]);

  return (
    <Context.Provider value={{ anchors, registerAnchor }}>{children}</Context.Provider>
  );
};

export interface TableOfContentAnchorProps {
  id: string,
  children?: ReactNode,
}

export const TableOfContentAnchor: FC<TableOfContentAnchorProps> = ({ id, children }) => {
  const ref = useTableOfContentAnchor(id, { label: children });

  return <a key={id} id={id} ref={ref} className="absolute" tabIndex={-1}/>;
};

export const useTableOfContentAnchor = (id: string, { label, enabled = true }: { label?: ReactNode, enabled?: boolean }) => {
  const { registerAnchor } = useContext(Context);
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(
    () => element && enabled ? registerAnchor({ id, element, label: label ?? id }) : undefined,
    [registerAnchor, id, element, label, enabled]
  );

  return setElement;
};

const toc = tv({
  slots: {
    base: 'sticky top-12 m-0 py-4 list-none',
    jumpItem: 'h-0 overflow-hidden focus-within:h-[initial] focus-within:overflow-[initial]',
    link: 'block py-1 pl-3 border-l-4 border-l-(--color-border) text-inherit no-underline cursor-pointer hover:bg-background-light hover:border-l-(--color-border-dark) focus-visible:outline-none focus-visible:shadow-focus',
  },
  variants: {
    active: {
      true: {
        link: 'border-(--hero-color,_var(--color-foreground)) hover:border-(--hero-color,_var(--color-foreground))',
      },
    }
  }
});

export const TableOfContent: FC = () => {
  const { anchors } = useContext(Context);
  const [activeId, setActiveId] = useState<string>();
  const shouldIgnoreScroll = useRef(false);

  // gets the id of the anchor that is currently in view
  const getActiveIdFromScroll = useCallback(() => {
    // get vertical scroll of window
    // round because high dpi screens might scroll to x.5 when using .scrollIntoView()
    // and this function then would detect the wrong active anchor
    const scrollTop = Math.round(window.scrollY);

    let topAnchor: Anchor | undefined;

    // anchors are always ordered as they appear in the document
    for(const anchor of anchors) {
      if(anchor.element.offsetTop - scrollTop <= 64) {
        // if the anchor is above 64px, set as topAnchor
        topAnchor = anchor;
      } else {
        // else this anchor is already too far down the page, so we can stop
        break;
      }
    }

    setActiveId(topAnchor?.id);
  }, [anchors]);

  // when the anchors change recalculate the active anchor
  useEffect(
    () => getActiveIdFromScroll(),
    [getActiveIdFromScroll]
  );

  // register scroll listener
  useEffect(() => {
    const listener = () => {
      // after manual scrollIntoView we ignore scroll events for some time to prevent flicker,
      // especially when scrolling to the last anchor, which probably is not the anchor by scrollTop
      if(shouldIgnoreScroll.current) {
        return;
      }

      getActiveIdFromScroll();
    };

    window.addEventListener('scroll', listener, { passive: true });
    return () => window.removeEventListener('scroll', listener);
  }, [getActiveIdFromScroll]);

  // ignores scroll events during the next 1000ms
  const ignoreScroll = useCallback(() => {
    shouldIgnoreScroll.current = true;
    setTimeout(() => { shouldIgnoreScroll.current = false; }, 1000);
  }, []);

  // focus first anchor
  const handleJumpToToc = useCallback<MouseEventHandler>((event) => {
    event.preventDefault();
    document.getElementById('toc')?.focus();
  }, []);

  // handle click on toc item
  const handleClick = useCallback((id: string, element: HTMLElement, event: React.MouseEvent) => {
    event.preventDefault();

    // tabIndex returns -1 even when tabIndex is unset
    // so we set it to -1 to make sure the element is focusable
    if(element.tabIndex === -1) {
      element.tabIndex = -1;
    }

    element.scrollIntoView({ behavior: 'smooth' });
    element.focus({ preventScroll: true });
    element.blur();

    ignoreScroll();
    setActiveId(id);
  }, [ignoreScroll]);

  const { base, jumpItem, link } = toc();

  return (
    <ol className={base()}>
      <li className={jumpItem()}>
        <a className={link()} href="#toc" tabIndex={1} onClick={handleJumpToToc}>
          Jump to Table Of Content
        </a>
      </li>
      {anchors.map(({ id, element, label }, index) => (
        <li key={id} className="">
          <a href={`#${id}`} id={index === 0 ? 'toc' : undefined} className={link({ active: activeId === id })} onClick={handleClick.bind(null, id, element)}>{label}</a>
        </li>
      ))}
    </ol>
  );
};
