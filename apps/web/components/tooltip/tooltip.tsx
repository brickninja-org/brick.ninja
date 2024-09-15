'use client';

import { Children, cloneElement, useMemo, useState, type FC, type HTMLProps, type ReactElement, type ReactNode } from 'react';
import { autoUpdate, flip, FloatingPortal, offset, shift, useClick, useClientPoint, useDismiss, useFloating, useHover, useInteractions, useMergeRefs, useRole, useTransitionStyles } from '@floating-ui/react';

export interface TooltipProps {
  children: ReactElement<HTMLProps<HTMLElement>>;
  content: ReactNode;
}

export const Tooltip: FC<TooltipProps> = ({ children, content }) => {
  const [open, setOpen] = useState(false);

  const { refs, context, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(16),
      flip({ padding: { top: 64, bottom: 8, left: 8, right: 8 }}),
      shift({ padding: 8, mainAxis: true, crossAxis: true }),
    ],
  });

  // Merge all the interaction into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClientPoint(context),
    useHover(context, { move: true, mouseOnly: true }),
    useClick(context, { ignoreMouse: true }),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
    useMemo(() => ({
      reference: {
        onClick(event) {
          if (!context.open && context.dataRef.current.openEvent && 'pointerType' in context.dataRef.current.openEvent && context.dataRef.current.openEvent.pointerType === 'touch') {
            event.preventDefault();
          }
        },
      },
    }), [context.open, context.dataRef]),
  ]);

  const { styles: transitionStyles, isMounted } = useTransitionStyles(context);

  const ref = useMergeRefs(children.props.ref ? [refs.setReference, children.props.ref] : [refs.setReference]);

  return (
    <>
      {cloneElement(Children.only(children), { ...getReferenceProps(children.props), ref })}
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            className="max-w-[min(500px,_calc(100vw_-_16px))] p-4 rounded-sm z-10 will-change-transform pointer-events-none shadow bg-white"
            style={{ ...transitionStyles, ...floatingStyles }}
            {...getFloatingProps()}
          >
            <div>{content}</div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
