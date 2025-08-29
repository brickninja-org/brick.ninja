'use client';

import type { FC, ReactNode } from 'react';
import { addToast, Alert, Form as HeroUIForm } from '@heroui/react';
import { useActionState, useCallback, useEffect } from 'react';

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

export const Form: FC<FormProps<FormState>> = ({ action, id, initialState, children }) => {
  const [state, formAction] = useActionState(action, initialState ?? {});

  const showAlert = useCallback((alert: HTMLElement | null) => {
    alert?.scrollIntoView({ block: 'nearest' });
  }, []);

  useEffect(() => {
    if (state.success) {
      addToast({ title: state.success });
    }
  }, [state.success]);

  return (
    <HeroUIForm id={id} action={formAction}>
      {state.error && (
        <Alert color="danger" ref={showAlert} key={crypto.randomUUID()}>{state.error}</Alert>
      )}
      {children}
    </HeroUIForm>
  );
};
