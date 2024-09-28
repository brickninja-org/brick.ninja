import { createContext } from 'react';

import type { ErrorCode } from './types';

export interface GetAccountOptions {
  includeHidden?: boolean;
}

export interface BricklinkApiContext {
  // getAccounts(requiredScopes: Scope[], optionalScopes?: Scope[], options?: GetAccountOptions): Promise<BrickLinkAccountWithHidden[]>;
  setHidden(id: string, isHidden: boolean): void;
  error: ErrorCode | undefined;
  // scopes: Scope[];
}

export const BricklinkApiContext = createContext<BricklinkApiContext>({
  // getAccounts: () => Promise.resolve([]),
  setHidden: () => {},
  error: undefined,
  // scopes: [],
});
