'use client';

import type { FC, FormEventHandler } from 'react';
import { Scope } from '@bn2me/client';

import { useCallback, useEffect, useState } from 'react';

import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';

import { useBn2MeClient } from '@/components/bn2me/Bn2Me.context';
import { useFedCM } from '@/components/bn2me/FedCM.context';
import { redirectToBn2Me } from './Login.action';
import { Checkbox } from '@brickninja-org/ui/components/form/Checkbox';

const allScopes = [
  Scope.Identify,
  Scope.Accounts,
  Scope.Accounts_DisplayName
];

export interface LoginButtonProps {
  scopes: Scope[];
  returnTo?: string;

  logout: boolean;
}

export const LoginButton: FC<LoginButtonProps> = ({ scopes, returnTo, logout }) => {
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
        scopes: fullPermissions ? allScopes : scopes,
        mediation: 'optional',
        signal: abort.signal,
        mode: 'passive',
        returnTo,
      });

      return () => abort.abort();
    }
  }, [bn2me.fedCM, logout, returnTo, fullPermissions, scopes, triggerFedCM]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback((e) => {
    // only handle submit if FedCM is supported
    if (!bn2me.fedCM.isSupported()) {
      return;
    }

    // cancel form submission
    e.preventDefault();

    triggerFedCM({
      scopes: fullPermissions ? allScopes : scopes,
      mediation: 'optional',
      mode: 'active',
      returnTo,
    });
  }, [bn2me.fedCM, returnTo, fullPermissions, scopes, triggerFedCM]);

  return (
    <>
      <Checkbox checked={fullPermissions} onChange={setFullPermissions}>
        <span className="relative top-[-1] leading-normal">
          Grant brick.ninja permissions to access your bn2.me account data required for all pages.
        </span>
      </Checkbox>
      {!fullPermissions && (
        <div className="mt-4 text-[15px] text-muted leading-tight">
          You might have to reauthorize again later to use some features.
        </div>
      )}

      <form action={redirectToBn2Me.bind(null, returnTo, fullPermissions ? allScopes.join(' ') : scopes.join(' '))} onSubmit={handleSubmit}>
        <SubmitButton className="w-full justify-center mt-8 py-3 px-4" icon="user" iconColor="(--icon-color:color-red-600)" type="submit">Login with bn2.me</SubmitButton>
      </form>
    </>
  );
};
