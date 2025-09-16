'use client';

import type { FC, ReactNode } from 'react';

import { createContext, use, useMemo } from 'react';
import { Bn2MeClient } from '@bn2me/client';

import { FedCMProvider } from './FedCM.context';

const Bn2MeContext = createContext<Bn2MeClient | undefined>(undefined);

export interface Bn2MeProviderProps {
  clientId: string,
  baseUrl?: string,

  children: ReactNode,
}

export const Bn2MeProvider: FC<Bn2MeProviderProps> = ({ clientId, baseUrl, children }) => {
  const bn2me = useMemo(
    () => new Bn2MeClient({ client_id: clientId }, { url: baseUrl }),
    [baseUrl, clientId],
  );

  return (
    <Bn2MeContext value={bn2me}>
      <FedCMProvider baseUrl={baseUrl}>
        {children}
      </FedCMProvider>
    </Bn2MeContext>
  );
};

export function useBn2MeClient() {
  return use(Bn2MeContext)!;
}
