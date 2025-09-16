import type { Scope } from '@bn2me/client';
import type { Bn2AccountWithHidden, ErrorCode } from './types';

import { createContext } from 'react';

export interface GetAccountsOptions {
  includeHidden?: boolean,
}

export interface Bn2APIContext {
  getAccounts(requiredScopes: Scope[], optionalScopes?: Scope[], options?: GetAccountsOptions): Promise<Bn2AccountWithHidden[]>,
  setHidden(id: string, isHidden: boolean): void,
  error: ErrorCode | undefined,
  scopes: Scope[],
}

export const Bn2APIContext = createContext<Bn2APIContext>({
  getAccounts: () => Promise.resolve([]),
  setHidden: () => {},
  error: undefined,
  scopes: [],
});
