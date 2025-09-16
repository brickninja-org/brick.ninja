'use client';

import type { FC, ReactNode } from 'react';
import type { Scope } from '@bn2me/client';
import type { GetAccountsOptions } from './Bn2API.context';

import type { Bn2Account } from './types';

import { experimental_useEffectEvent as useEffectEvent, useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Button, LinkButton } from '@brickninja-org/ui/components/form/Button';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';

import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { useFedCM } from '@/components/bn2me/FedCM.context';
import { useUserPromise } from '@/components/user/use-user';

import { fetchAccounts } from './fetch-account.actions';
import { reauthorize } from './reauthorize';
import { ErrorCode } from './types';
import { Bn2APIContext } from './Bn2API.context';

export interface Bn2APIProviderProps {
  children: ReactNode,
}

const initialGrantedScopes: Scope[] = [];

export const Bn2APIProvider: FC<Bn2APIProviderProps> = ({ children }) => {
  const accounts = useRef<[Scope[], Promise<Bn2Account[]>]>(undefined);
  const [error, setError] = useState<ErrorCode>();
  const [grantedScopes, setGrantedScopes] = useState<Scope[]>(initialGrantedScopes);
  const [missingScopes, setMissingScopes] = useState<Scope[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const userPromise = useUserPromise();
  const [hiddenAccounts, setHiddenAccounts] = useLocalStorageState<string[]>('accounts.hidden', []);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo = pathname + (searchParams.size > 0 ? '?' + searchParams : '');
  const loginUrl = `/login?returnTo=${encodeURIComponent(returnTo)}&scopes=${encodeURIComponent(missingScopes.join(','))}`;

  const getAccounts = useCallback(async (requiredScopes: Scope[], optionalScopes: Scope[] = [], { includeHidden = false }: GetAccountsOptions = {}) => {
    // always return [] during SSR
    if (typeof window === 'undefined') {
      return [];
    }

    const user = await userPromise;

    // if the user is not logged in and hasn't dismissed the toast yet show error
    if (!user) {
      if (!dismissed) {
        setError(ErrorCode.NOT_LOGGED_IN);
        setMissingScopes([...requiredScopes, ...optionalScopes]);
      }

      // no accounts :(
      return [];
    }

    // get previous (pending) request
    const [requestedScopes, pendingPromise] = accounts.current ?? [[] as Scope[], undefined];

    const filterHiddenAccounts = (accounts: Bn2Account[]) => accounts
      .map((account) => ({ ...account, hidden: hiddenAccounts.includes(account.id) }))
      .filter((account) => !account.hidden || includeHidden);

    // if there was no previous request yet or we need more permissions
    if (!pendingPromise || !requestedScopes.every((required) => requestedScopes.includes(required))) {
      // always add to the scope, so we request the max amount of scopes the user has encountered
      const combinedScopes = [...requestedScopes, ...requiredScopes];

      // fetch accounts
      // TODO: we might be able to even skip the request if we know we are missing scopes...
      const promise = fetchAccounts(combinedScopes).then((response) => {
        if (response.error !== undefined) {
          setError(response.error);
          setGrantedScopes([]);
          setMissingScopes([...combinedScopes, ...optionalScopes]);
          return [];
        }

        setGrantedScopes(response.scopes);

        const missingOptionalScopes = optionalScopes.filter((scope) => !response.scopes.includes(scope));
        if (missingOptionalScopes.length > 0) {
          setMissingScopes(missingOptionalScopes);
        }

        return response.accounts;
      });

      accounts.current = [combinedScopes, promise];

      return promise.then(filterHiddenAccounts);
    }

    const missingOptionalScopes = optionalScopes.filter((scope) => !requestedScopes.includes(scope));
    if (missingOptionalScopes.length > 0) {
      setMissingScopes((missingScopes) => Array.from(new Set([...missingScopes, ...missingOptionalScopes])));
    }

    return pendingPromise.then(filterHiddenAccounts);
  }, [dismissed, hiddenAccounts, userPromise]);

  const handleDismiss = useCallback(() => {
    setError(undefined);
    setDismissed(true);
  }, []);

  // const scopes = useStablePrimitiveArray(grantedScopes);
  const scopes = grantedScopes;

  const setHidden = useCallback((id: string, hidden: boolean) => {
    setHiddenAccounts((hiddenAccounts) => hidden ? [...hiddenAccounts, id] : hiddenAccounts.filter((accountId) => accountId !== id));
  }, [setHiddenAccounts]);

  const triggerFedCM = useFedCM();
  // attempt silent logins
  const triggerSilentFedCM = useEffectEvent(() => {
    triggerFedCM({
      returnTo,
      scopes: missingScopes,
      mediation: 'silent',
      mode: 'passive',
    });
  });

  useEffect(() => {
    if (error === ErrorCode.NOT_LOGGED_IN) {
      triggerSilentFedCM();
    }
  // react-hooks/exhaustive-deps doesn't correctly handle useEffectEvent yet
  // eslint-disable-next-line react-compiler/react-compiler
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // make sure the context value only changes if error changes
  const value = useMemo(() => ({ getAccounts, setHidden, error, scopes }), [getAccounts, setHidden, scopes, error]);

  return (
    <Bn2APIContext.Provider value={value}>
      {children}
      {(error === ErrorCode.NOT_LOGGED_IN) && pathname !== '/login' && (
        <div className="fixed bottom-8 right-8 flex flex-wrap gap-4 items-center justify-between shadow-(--shadow-base) rounded-xs bg-background border border-(--color-border-dark) p-4 z-1">
          <p>Login to brick.ninja to access your account.</p>
          <div>
            <FlexRow>
              <Button onClick={handleDismiss}>Later</Button>
              <LinkButton icon="user" href={loginUrl}>Login</LinkButton>
            </FlexRow>
          </div>
        </div>
      )}

      {(error === ErrorCode.REAUTHORIZE || error === ErrorCode.MISSING_PERMISSION || (missingScopes.some((scope) => !grantedScopes.includes(scope)) && !dismissed && grantedScopes !== initialGrantedScopes)) && (
        <form className="fixed bottom-8 right-8 flex flex-wrap gap-4 items-center justify-between shadow-(--shadow-base) rounded-xs bg-background border border-(--color-border-dark) p-4 z-1" action={reauthorize.bind(null, missingScopes, undefined)}>
          <p>Authorize brick.ninja to access your accounts.</p>
          <div>
            <FlexRow>
              <Button onClick={handleDismiss}>Later</Button>
              <SubmitButton type="submit" icon="user">Authorize</SubmitButton>
            </FlexRow>
          </div>
        </form>
      )}
    </Bn2APIContext.Provider>
  );
};
