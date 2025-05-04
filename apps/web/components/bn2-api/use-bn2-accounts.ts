import type { GetAccountsOptions } from './Bn2API.context';
import type { Bn2AccountWithHidden } from './types';

import { useContext, useEffect, useMemo, useState } from 'react';
import { Scope } from '@bn2me/client';

import { Bn2APIContext } from './Bn2API.context';

type UseBn2AccountsResult =
  | { loading: true; }
  | { loading: false; error: true; }
  | { loading: false; error: false; accounts: Bn2AccountWithHidden[]; scopes: Scope[]; };

const loading: Bn2AccountWithHidden[] = [];
const defaultOptionalScopes: Scope[] = [];
const defaultOptions: GetAccountsOptions = {};

// TODO: when using `useBn2Accounts([])`, this will fetch accounts in an infinite loop,
// because we are passing a new array every time. This should be fixed in this hook.
export function useBn2Accounts(
  requiredScopes: Scope[],
  optionalScopes: Scope[] = defaultOptionalScopes,
  options: GetAccountsOptions = defaultOptions,
): UseBn2AccountsResult {
  const [accounts, setAccounts] = useState<Bn2AccountWithHidden[]>(loading);
  const { getAccounts, scopes } = useContext(Bn2APIContext);

  useEffect(() => {
    // always require at least `accounts` scope
    const scopes = Array.from(new Set([Scope.Accounts, ...requiredScopes]));

    // get accounts
    getAccounts(scopes, optionalScopes, options).then(setAccounts);
  }, [getAccounts, requiredScopes, optionalScopes, options]);

  return useMemo<UseBn2AccountsResult>(() => {
    if (accounts === loading) {
      return { loading: true };
    }

    return { loading: false, error: false, accounts, scopes };
  }, [accounts, scopes]);
}
