'use client';

import { useActionState, useCallback, type FC, type ReactNode } from 'react';

import { Notice } from '../notice';

export interface FormState {
  error?: string;
  success?: string;
}

export interface FormProps<State> {
  action: (state: State, payload: FormData) => Promise<State>;
  initialState?: State;
  children: ReactNode;
  id?: string;
}

export const Form: FC<FormProps<FormState>> = ({ action, initialState, children, id }) => {
  const [state, formAction] = useActionState(action, initialState ?? {});

  const showNotice = useCallback((notice: HTMLElement | null) => {
    notice?.scrollIntoView({ block: 'nearest' });
  }, []);

  return (
    <form action={formAction} id={id}>
      {state.error && (
        <Notice color="error" ref={showNotice} key={crypto.randomUUID()}>{state.error}</Notice>
      )}
      {state.success && (
        <Notice color="success" ref={showNotice} key={crypto.randomUUID()}>{state.success}</Notice>
      )}

      {children}
    </form>
  );
};
