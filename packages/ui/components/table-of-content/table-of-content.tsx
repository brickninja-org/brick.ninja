'use client';

import { createContext, useCallback, useContext, useEffect, useReducer, useState, type FC, type ReactNode } from 'react';

type Anchor = {
  id: string;
  element: HTMLElement;
  label: ReactNode;
};

type Context = {
  anchors: Anchor[];
  registerAnchor: (anchor: Anchor) => () => void;
};

const Context = createContext<Context>({
  anchors: [],
  registerAnchor: () => () => {},
});

export interface TableOfContentContextProps {
  children: ReactNode;
}

type Action = {
  type: 'register';
  anchor: Anchor;
} | {
  type: 'unregister';
  anchor: Anchor;
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
  id: string;
  children?: ReactNode;
}

export const TableOfContentAnchor: FC<TableOfContentAnchorProps> = ({ id, children }) => {
  const ref = useTableOfContentAnchor(id, { label: children });

  return <a key={id} id={id} ref={ref} className="" tabIndex={-1}/>;
};

export const useTableOfContentAnchor = (id: string, { label, enabled = true }: { label?: ReactNode, enabled?: boolean }) => {
  const { registerAnchor } = useContext(Context);
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(
    () => element && enabled ? registerAnchor({ id, element, label }) : undefined,
    [registerAnchor, id, element, label, enabled]
  );

  return setElement;
};