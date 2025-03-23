'use client';

import type { ReactElement, ReactNode } from 'react';
import type { GetAccountOptions } from './bricklink-api-context';
import type { BricklinkAccount } from './types';

import { useUser } from '@/components/user/use-user';
import { BricklinkAccountLoginNotice } from './bricklink-account-login-notice';

export interface BricklinkAccountsProps {
  children?: (accounts: BricklinkAccount[] /*, scopes: Scope[] */) => ReactElement;
  // requiredScopes: Scope[];
  // optionalScopes?: Scope[];
  options?: GetAccountOptions;
  loading?: ReactNode;
  authorizationMessage?: ReactNode;
  loginMessage?: ReactNode;
}

export const BricklinkAccounts = ({ children, /*, options, loading, */ authorizationMessage, loginMessage }: BricklinkAccountsProps) => {
  const user = useUser();

  if (!user) {
    return loginMessage === null ? null : (
      <BricklinkAccountLoginNotice requiredScopes={[]} optionalScopes={[]}>
        {loginMessage ?? authorizationMessage}
      </BricklinkAccountLoginNotice>
    );
  }

  if (typeof children === 'function') {
    return children?.([] /* accounts.accounts, accounts.scopes */);
  }

  return children;
};
