import type { FC, ReactNode } from 'react';

import { useId } from 'react';
import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useDismiss, useFloating, useInteractions, useRole, useTransitionStyles } from '@floating-ui/react';

import { Icon } from '../../icons';
import { TableOfContentContext } from '../table-of-content/TableOfContents';

export interface DialogProps {
  children: ReactNode;
  title: ReactNode;
  open?: boolean;
  onClose: () => void;
}

export const Dialog: FC<DialogProps> = ({ children, title, open, onClose }) => {
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
        <FloatingFocusManager context={context}>
          <div ref={refs.setFloating} aria-labelledby={labelId} className="absolute top-14 sm:top-32 flex flex-col mx-auto max-w-none sm:max-w-[calc(100vw - 100px)] max-h-[calc(100vh_-_72px)] sm:max-h-[calc(100vh_-_160px)] min-w-0 sm:min-w-[500px] w-[calc(100vw_-_32px)] sm:w-auto rounded-xs shadow border bg-white overflow-hidden [--table-sticky-top:_-16px]" {...getFloatingProps()}>
            <div className="flex items-center p-2 pr-4 border-b leading-6 font-medium">
              <header id={labelId}>{title}</header>
              <button type="button" className="flex items-center justify-center w-8 h-8 ml-auto p-2 rounded-xs bg-(--color-background) hover:bg-gray-100 text-gray-700 leading-5 cursor-pointer will-change-transform transition-background" onClick={onClose}><Icon icon="dismiss"/></button>
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
