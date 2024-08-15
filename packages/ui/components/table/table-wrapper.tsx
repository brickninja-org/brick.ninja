'use client';

import { Children, cloneElement, useCallback, useLayoutEffect, useRef, useState, type FC, type HTMLProps, type ReactElement } from 'react';
import { useResizeObserver } from '../../lib/hooks/resize-observer';
import { tv } from 'tailwind-variants';

export interface TableWrapperProps {
  children: ReactElement<HTMLProps<HTMLElement>>;
}

const wrapperStyles = tv({
  base: 'overflow-clip width-[calc(100%_+_32px)] mb-4 -mx-4 px-4',
  variants: {
    overflow: {
      true: 'overflow-x-scroll will-change-scroll-position',
    },
  },
  defaultVariants: {
    overflow: false,
  },
});

export const TableWrapper: FC<TableWrapperProps> = ({ children }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLElement>(null);

  const checkOverflow = useCallback(() => {
    setIsOverflowing(() => wrapper.current ? wrapper.current.clientWidth < wrapper.current.scrollWidth : false);
  }, []);

  // check overflow on mount
  useLayoutEffect(checkOverflow, [checkOverflow]);

  // use a resize observer to subscribe to size changes the wrapper and inner table
  useResizeObserver(wrapper, checkOverflow);
  useResizeObserver(table, checkOverflow);

  return (
    <div className={wrapperStyles({overflow: isOverflowing})} ref={wrapper}>
      {cloneElement(Children.only(children), { ref: table })}
    </div>
  );
};
