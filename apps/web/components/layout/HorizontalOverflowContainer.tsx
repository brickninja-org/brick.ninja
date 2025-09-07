'use client';

import type { FC, ReactNode } from 'react';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@heroui/react';
import { Icon } from '@brickninja-org/ui/icons';
import { useResizeObserver } from '@brickninja-org/ui/lib/hooks/resize-observer';


export interface HorizontalOverflowContainerProps {
  children: ReactNode;
  inverted?: boolean;
}

export const HorizontalOverflowContainer: FC<HorizontalOverflowContainerProps> = ({ children, inverted = false }) => {
  const content = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleScrollLeft = useCallback(() => {
    if (content.current) {
      const scrollBy = Math.min(400, content.current.offsetWidth * 0.66);
      content.current.scrollBy({ left: -scrollBy, behavior: 'smooth' });
    }
  }, []);

  const handleScrollRight = useCallback(() => {
    if (content.current) {
      const scrollBy = Math.min(400, content.current.offsetWidth * 0.66);
      content.current.scrollBy({ left: scrollBy, behavior: 'smooth' });
    }
  }, []);

  useResizeObserver(content, () => {
    const element = content.current;

    setCanScrollLeft(element ? element.scrollLeft > 0 : false);
    setCanScrollRight(element ? Math.ceil(element.scrollLeft) < element.scrollWidth - element.offsetWidth : false);
  });

  useEffect(() => {
    if (!content.current || (!canScrollLeft && !canScrollRight)) {
      return;
    }

    const element = content.current;

    const handler = () => {
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(Math.ceil(element.scrollLeft) < element.scrollWidth - element.offsetWidth);
    };
    element.addEventListener('scroll', handler, { passive: true });

    return () => element.removeEventListener('scroll', handler);
  }, [canScrollLeft, canScrollRight]);

  return (
    <div className={cn('relative overflow-hidden', inverted ? 'bg-background-light' : 'bg-background')}>
      <button className={cn(['absolute top-0 bottom-0 left-0 w-12 px-2 pr-4 cursor-pointer z-1 focus:outline-none', !canScrollLeft && 'opacity-0 pointer-events-none hover:opacity-100 hover:[pointer-events:initial] hover:cursor-default'])} tabIndex={-1} onClick={handleScrollLeft} aria-hidden><Icon icon="chevron-left"/></button>
      <div className="overflow-x-auto scroll-px-[128px] [scrollbar-width:none] [-ms-overflow-style:none]" ref={content}>
        {children}
      </div>
      <button className={cn(['absolute top-0 bottom-0 right-0 w-12 pl-4 px-2 cursor-pointer z-1', !canScrollRight && 'opacity-0 pointer-events-none hover:opacity-100 hover:[pointer-events:initial] hover:cursor-default'])} tabIndex={-1} onClick={handleScrollRight} aria-hidden><Icon icon="chevron-right"/></button>
    </div>
  );
};
