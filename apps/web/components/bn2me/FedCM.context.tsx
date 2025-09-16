'use client';

import type { FC, ReactNode } from 'react';
import type { FedCMRequestOptions } from '@bn2me/client';

import { createContext, use, useCallback } from 'react';

import { prepareAuthRequest } from 'app/[language]/login/Login.action';
import { useBn2MeClient } from './Bn2Me.context';

export interface FedCMTriggerOptions extends Omit<FedCMRequestOptions, 'state' | 'code_challenge' | 'code_challenge_method'> {
  returnTo?: string,
}

const FedCMContext = createContext<(options: FedCMTriggerOptions) => Promise<void>>(() => new Promise(() => {}));

export interface FedCMProviderProps {
  baseUrl?: string,
  children: ReactNode,
}

export const FedCMProvider: FC<FedCMProviderProps> = ({ baseUrl, children }) => {
  const bn2me = useBn2MeClient();

  const trigger = useCallback(async ({ returnTo, ...requestOptions }: FedCMTriggerOptions) => {
    // check if FedCM is supported
    if (!bn2me.fedCM.isSupported()) {
      return;
    }

    // generate state and PKCE on server
    const auth = await prepareAuthRequest(returnTo);

    const credential = await bn2me.fedCM.request({
      ...requestOptions,
      ...auth.pkce,
    });

    // check if we get a token back
    if (credential) {
      // generate callback url
      const params = new URLSearchParams();
      params.set('iss', baseUrl ?? 'https://bn2me.vercel.app');
      params.set('state', auth.state);
      params.set('code', credential.token);

      // redirect to callback url
      location.href = `/auth/callback?${params}`;
    }
  }, [baseUrl, bn2me.fedCM]);

  return (
    <FedCMContext value={trigger}>
      {children}
    </FedCMContext>
  );
};

export function useFedCM() {
  return use(FedCMContext)!;
}
