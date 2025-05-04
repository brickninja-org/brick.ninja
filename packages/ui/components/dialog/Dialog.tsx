import type { FC, ReactNode, RefObject } from 'react';

import { useId } from 'react';
import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useDismiss, useFloating, useInteractions, useRole, useTransitionStyles } from '@floating-ui/react';

import { Icon } from '../../icons';
import { TableOfContentContext } from '../table-of-content/TableOfContents';

export interface DialogProps {
  children: ReactNode;
  title: ReactNode;
  open?: boolean;
  onClose: () => void;
  initialFocus?: number | RefObject<HTMLElement | null>;
}

export const Dialog: FC<DialogProps> = ({ children, title, open, initialFocus, onClose }) => {
  const { refs, context } = useFloating({
    open,
    onOpenChange: onClose,
  });

  const { getFloatingProps } = useInteractions([
    useDismiss(context, {
      outsidePress: false,
      outsidePressEvent: 'mousedown',
    }),
    useRole(context),
  ]);

  const labelId = useId();

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context);

  return isMounted ? (
    <FloatingPortal>
      <FloatingOverlay className="fixed top-0 bottom-0 left-0 right-0 flex justify-center bg-black/5 backdrop-blur-[1px] z-10" style={transitionStyles}>
        <FloatingFocusManager context={context} initialFocus={initialFocus}>
          <div ref={refs.setFloating} aria-labelledby={labelId} className="absolute top-14 sm:top-32 flex flex-col mx-auto max-w-none sm:max-w-[calc(100vw-100px)] max-h-[calc(100vh-72px)] sm:max-h-[calc(100vh-160px)] min-w-0 sm:min-w-[500px] w-[calc(100vw-32px)] sm:w-auto rounded-xs shadow border bg-background overflow-hidden [--table-sticky-top:-16px]" {...getFloatingProps()}>
            <div className="flex items-center p-2 pr-4 border-b leading-6 font-medium">
              <header id={labelId}>{title}</header>
              <button type="button" className="flex items-center justify-center w-8 h-8 ml-auto p-2 rounded-xs bg-background hover:bg-background-light text-muted leading-5 cursor-pointer will-change-transform transition-background" onClick={onClose}><Icon icon="close"/></button>
            </div>
            <div className="p-4 overflow-auto overscroll-contain">
              <TableOfContentContext>
                {children}
              </TableOfContentContext>
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  ) : null;
};
