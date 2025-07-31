'use client';

import type { FC, ReactElement, HTMLProps } from 'react';

import { Children, cloneElement, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useMergeRefs } from '@floating-ui/react';
import { tv } from 'tailwind-variants';

import { useResizeObserver } from '../../lib/hooks/resize-observer';

export interface TableWrapperProps {
  children: ReactElement<HTMLProps<HTMLElement>>;
}

const wrapperStyles = tv({
  base: 'overflow-clip width-[calc(100%+32px)] mb-4 -mx-4 px-4',
  variants: {
    overflow: {
      true: 'overflow-x-scroll will-change-scroll-position [&>table>thead>tr>th]:static',
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

  // @ts-expect-error this is a workaround, because react@19 somehow broke passing children elements (TableWrapper is a client component, children is usually a server component)
  //   before react@19 `children` was `<Lazy/>`, now it is `{ $$typeof: Symbol(react.lazy) }`.
  //   We need access to the component props (especially ref) for the tooltip to function correctly
  //   This seems to work for now, but I need to create a reproduction for this and report it to get it fixed.
  if(children.$$typeof === Symbol.for('react.lazy')) { children = use(children._payload); }

  return (
    <div className={wrapperStyles({ overflow: isOverflowing })} ref={wrapper} data-table-overflow={isOverflowing ? '' : undefined}>
      {cloneElement(Children.only(children), { ref: useMergeRefs([table, children.props.ref]) })}
    </div>
  );
};
