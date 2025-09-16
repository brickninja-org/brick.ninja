'use client';

import type { FC, ReactElement, ReactNode, HTMLProps } from 'react';
import type { Placement } from '@floating-ui/react';

import { Children, cloneElement, useRef, useState } from 'react';
import { arrow, autoUpdate, flip, FloatingArrow, FloatingPortal, offset, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole, useTransitionStyles } from '@floating-ui/react';

export interface TipProps {
  children: ReactElement<HTMLProps<HTMLElement>>,
  tip: ReactNode,
  preferredPlacement?: Placement,
}

export const Tip: FC<TipProps> = ({ children, tip, preferredPlacement = 'top' }) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);

  const { context, refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: preferredPlacement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ padding: { top: 64, bottom: 8, left: 8, right: 8 }}),
      shift({ padding: 8 }),
      arrow({ element: arrowRef, padding: 4 }),
    ],
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { move: false }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ]);

  const { styles: transitionStyles, isMounted } = useTransitionStyles(context);

  return (
    <>
      {cloneElement(Children.only(children), { ref: refs.setReference, ...getReferenceProps(children.props) })}
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className="w-max py-1.5 px-3 rounded-xs shadow bg-white text-sm z-10 opacity-100"
            style={{
              ...transitionStyles,
              ...floatingStyles,
            }}
            {...getFloatingProps()}
          >
            {tip}
            <FloatingArrow context={context} ref={arrowRef} width={12} height={6} tipRadius={1} fill="var(--color-background)"/>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
