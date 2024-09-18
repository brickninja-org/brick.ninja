import { useId, type FC, type ReactNode } from 'react';
import { FloatingFocusManager, FloatingOverlay, FloatingPortal, useDismiss, useFloating, useInteractions, useRole, useTransitionStyles } from '@floating-ui/react';
import { VscChromeClose } from 'react-icons/vsc';

import { TableOfContentContext } from '../table-of-content';

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
      <FloatingOverlay className="fixed top-0 bottom-0 left-0 right-0 flex justify-center bg-[rgba(0,0,0,0.2)] backdrop-blur-[1px] z-10" style={transitionStyles}>
        <FloatingFocusManager context={context}>
          <div ref={refs.setFloating} aria-labelledby={labelId} className="absolute top-14 sm:top-32 flex flex-col mx-auto w-[calc(100vw_-_32px)] sm:w-auto max-h-[calc(100vh_-_160px)] sm:max-w-[calc(100vw_-_100px)] sm:min-w-[500px] bg-[--color-background] border shadow rounded-sm overflow-hidden" {...getFloatingProps()}>
            <div className="flex items-center p-2 pr-4 border-b leading-6 font-medium">
              <header id={labelId}>{title}</header>
              <button type="button" className="w-8 h-8 ml-auto p-2 rounded-sm bg-[--color-background] hover:bg-gray-100 text-gray-700 leading-4 cursor-pointer will-change-transform transition-background" onClick={onClose}><VscChromeClose/></button>
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
