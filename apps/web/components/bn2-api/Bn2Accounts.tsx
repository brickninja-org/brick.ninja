'use client';

import type { FC, ReactElement, ReactNode } from 'react';
import type { Scope } from '@bn2me/client';
import type { Bn2Account } from './types';
import type { GetAccountsOptions } from './Bn2API.context';

import { Suspense } from 'react';

import { Skeleton } from '@/components/skeleton/Skeleton';
import { useUser } from '@/components/user/use-user';
import { useBn2Accounts } from './use-bn2-accounts';
import { Bn2AccountAuthorizationNotice } from './Bn2AccountAuthorizationNotice';
import { Bn2AccountLoginNotice } from './Bn2AccountLoginNotice';

export interface Bn2AccountsProps {
  children?: ((accounts: Bn2Account[], scopes: Scope[]) => ReactElement | ReactElement[]) | ReactNode;
  requiredScopes: Scope[];
  optionalScopes?: Scope[];
  options?: GetAccountsOptions;
  loading?: ReactNode;
  authorizationMessage?: ReactNode;
  loginMessage?: ReactNode;
}

export const Bn2Accounts: FC<Bn2AccountsProps> = ({ loading, ...props }) => {
  return (
    <Suspense fallback={loading !== undefined ? loading : <Skeleton/>}>
      <B2AccountsInternal loading={loading} {...props}/>
    </Suspense>
  );
};

const B2AccountsInternal: FC<Bn2AccountsProps> = ({ children, requiredScopes, optionalScopes = [], options, authorizationMessage, loginMessage, loading }) => {
  const user = useUser();
  const accounts = useBn2Accounts(requiredScopes, optionalScopes, options);

  if (accounts.loading) {
    return loading !== undefined ? loading : <Skeleton/>;
  }

  if (!user) {
    return loginMessage === null
      ? null
      : (
        <Bn2AccountLoginNotice requiredScopes={requiredScopes} optionalScopes={optionalScopes}>
          {loginMessage ?? authorizationMessage}
        </Bn2AccountLoginNotice>
      );
  }

  if (accounts.error) {
    return (
      <span className="text-error">Error loading accounts from the Rebrickable API.</span>
    );
  }

  if (requiredScopes.some((scope) => !accounts.scopes.includes(scope))) {
    return authorizationMessage === null
      ? null
      : (
        <Bn2AccountAuthorizationNotice scopes={accounts.scopes} requiredScopes={requiredScopes} optionalScopes={optionalScopes}>
          {authorizationMessage ?? loginMessage}
        </Bn2AccountAuthorizationNotice>
      );
  }

  if (typeof children === 'function') {
    return children?.(accounts.accounts, accounts.scopes);
  }

  return children;
};
