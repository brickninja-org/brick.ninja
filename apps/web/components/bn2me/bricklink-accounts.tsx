'use client';

import type { ReactElement, ReactNode } from 'react';
import type { GetAccountOptions } from './bricklink-api-context';
import type { BricklinkAccount } from './types';

import { useUser } from '@/components/user/use-user';
import { Skeleton } from '@/components/skeleton/Skeleton';
import { BricklinkAccountLoginNotice } from './bricklink-account-login-notice';

export interface BricklinkAccountsProps {
  children?: (accounts: BricklinkAccount[] /*, scopes: Scope[] */) => ReactElement;
  // requiredScopes: Scope[];
  // optionalScopes?: Scope[];
  options?: GetAccountOptions;
  loading?: ReactNode;
  authorizationMessage?: ReactNode;
}

export const BricklinkAccounts = ({ children, /*, options, */ loading, authorizationMessage }: BricklinkAccountsProps) => {
  const user = useUser();
  user.loading = false; // TODO: remove this line
  // const accounts = useBricklinkAccounts(requiredScopes, optionalScopes, options);

  if (user.loading /* || accounts.loading */) {
    return loading !== undefined ? loading : <Skeleton/>;
  }

  if (!user.user) {
    return (
      <BricklinkAccountLoginNotice requiredScopes={[]} optionalScopes={[]}>
        {authorizationMessage}
      </BricklinkAccountLoginNotice>
    );
  }

  return children?.([] /* accounts.accounts, accounts.scopes */);
};
