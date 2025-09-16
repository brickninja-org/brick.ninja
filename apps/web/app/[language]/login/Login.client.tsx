'use client';

import type { FC, FormEventHandler } from 'react';
import type { TranslationSubset } from '@/lib/translate';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { Scope } from '@bn2me/client';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';

import { useBn2MeClient } from '@/components/bn2me/Bn2Me.context';
import { useFedCM } from '@/components/bn2me/FedCM.context';
import { redirectToBn2Me } from './Login.action';
import { Checkbox } from '@brickninja-org/ui/components/form/Checkbox';

const fullScopes = [
  Scope.Identify,
  Scope.Accounts,
  Scope.Accounts_DisplayName
];

export interface LoginButtonProps {
  scopes: Scope[],
  returnTo?: string,

  logout: boolean,

  translations: TranslationSubset<'login.button' | 'login.grant-all' | 'login.grant-all.hint'>,
}

export const LoginButton: FC<LoginButtonProps> = ({ scopes, returnTo, logout, translations }) => {
  const form = useRef<HTMLFormElement>(null);
  const [error, setError] = useState(false);

  const bn2me = useBn2MeClient();
  const triggerFedCM = useFedCM();
  const [fullPermissions, setFullPermissions] = useState(true);

  useEffect(() => {
    // check if FedCM is supported
    if (bn2me.fedCM.isSupported()) {
      // if the user got the login page by logging out, prevent silent FedCM and return to not attempt passive login
      if (logout) {
        navigator.credentials.preventSilentAccess();
        return;
      }

      const abort = new AbortController();

      triggerFedCM({
        scopes: fullPermissions ? fullScopes : scopes,
        mediation: 'optional',
        signal: abort.signal,
        mode: 'passive',
        returnTo,
      });

      return () => abort.abort();
    }
  }, [bn2me.fedCM, fullPermissions, logout, returnTo, scopes, triggerFedCM]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    // only handle submit if FedCM is supported
    if (!bn2me.fedCM.isSupported() || error) {
      return;
    }

    // cancel form submission
    e.preventDefault();

    triggerFedCM({
      scopes: fullPermissions ? fullScopes : scopes,
      mediation: 'optional',
      mode: 'active',
      returnTo,
    }).catch((error) => {
      console.error(error);
      setError(true);

      // attempt resubmit without FedCM if FedCM is not supported
      if (error instanceof Error && error.name === 'NotSupportedError') {
        form.current?.requestSubmit();
      }
    });
  }, [bn2me.fedCM, error, fullPermissions, returnTo, scopes, triggerFedCM]);

  return (
    <>
      <Checkbox checked={fullPermissions} onChange={setFullPermissions}>
        <span className="relative top-[-1] leading-normal">{translations['login.grant-all']}</span>
      </Checkbox>
      {!fullPermissions && (
        <div className="mt-4 text-[15px] text-muted leading-tight">
          {translations['login.grant-all.hint']}
        </div>
      )}

      <form action={redirectToBn2Me.bind(null, returnTo, (fullPermissions ? fullScopes : scopes).join(' '))} onSubmit={handleSubmit}>
        <SubmitButton className="w-full justify-center mt-8 py-3 px-4" icon="user" iconColor="(--icon-color:color-red-600)" type="submit">
          {translations['login.button']}
        </SubmitButton>
      </form>

      {error && (
        <div className="mt-2 text-medium text-red-600 leading-tight">
          Error during authentication. Please contact <Link href="/about#contact">support</Link> if this error persists.
        </div>
      )}
    </>
  );
};
