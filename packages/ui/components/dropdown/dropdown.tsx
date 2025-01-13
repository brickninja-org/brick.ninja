'use client';

import { Children, cloneElement, useRef, useState, type FC, type HTMLProps, type ReactElement, type ReactNode } from 'react';
import { arrow, autoUpdate, flip, FloatingArrow, FloatingFocusManager, FloatingPortal, hide, offset, shift, size, useClick, useDismiss, useFloating, useFocus, useInteractions, useTransitionStyles, type Placement } from '@floating-ui/react';

import { isTruthy } from '@brickninja-org/helper/is';

export interface DropdownProps {
  button: ReactElement<HTMLProps<HTMLElement>>;
  children: ReactNode;
  preferredPlacement?: Placement;
  hideTop?: boolean;
}

export const Dropdown: FC<DropdownProps> = ({ children, button, preferredPlacement = 'bottom-end', hideTop = true }) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<SVGSVGElement>(null);
  const padding = { top: 48 + 8, bottom: 8, left: 8, right: 8 };

  const { context, middlewareData, refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: preferredPlacement,
    whileElementsMounted: autoUpdate,
    strategy: hideTop ? 'absolute' : 'fixed',
    middleware: [
      offset(8),
      flip({ padding, crossAxis: false, fallbackAxisSideDirection: 'end' }),
      shift({ padding }),
      shift({ padding: { top: 48 + 48 + 8 }, rootBoundary: 'document' }),
      hideTop && hide({ padding: { top: 48 }}),
      size({ padding, apply({ availableHeight, elements }) { elements.floating.style.setProperty('--max-height', `${availableHeight}px`); } }),
      arrow({ element: arrowRef, padding: 4 }),
    ].filter(isTruthy),
  });

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useFocus(context),
    useDismiss(context),
    useClick(context),
  ]);

  const { styles: transitionStyles, isMounted } = useTransitionStyles(context);

  return (
    <>
      {cloneElement(Children.only(button), { ref: refs.setReference, ...getReferenceProps({ ...button.props, onClick: (e) => e.preventDefault() }) })}
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className="max-h-(--max-height) rounded-xs shadow border bg-white z-10"
            style={{
              ...transitionStyles,
              ...floatingStyles,
              visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible',
            }}
            {...getFloatingProps()}
          >
            <FloatingFocusManager context={context} modal={false}>
              <div className="max-h-[calc(var(--max-height)_-_2px)] p-2 overflow-y-auto overscroll-y-contain">
                {children}
              </div>
            </FloatingFocusManager>
            <FloatingArrow context={context} ref={arrowRef} width={12} height={6} tipRadius={1} fill="var(--color-background)" stroke="var(--color-border-dark)" strokeWidth={1}/>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
