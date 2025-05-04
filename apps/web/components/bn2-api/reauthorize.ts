'use server';
import 'server-only';

import type { AuthorizationUrlParams } from '@bn2me/client';

import { redirect } from 'next/navigation';
import { Scope } from '@bn2me/client';

import { bn2me } from '@/lib/bn2me';
import { getCurrentUrl } from '@/lib/url';
import { prepareAuthRequest } from 'app/[language]/login/Login.action';

export async function reauthorize(requiredScopes: Scope[], prompt?: AuthorizationUrlParams['prompt']) {
  // build redirect url
  const currentUrl = await getCurrentUrl();
  const redirect_uri = new URL('/auth/callback', currentUrl).toString();

  // get scopes
  const scopes = Array.from(new Set([Scope.Identify, Scope.Accounts, Scope.Accounts_DisplayName, ...requiredScopes]));

  const auth = await prepareAuthRequest(currentUrl.pathname + currentUrl.search);

  // get bn2.me auth url
  const url = bn2me.getAuthorizationUrl({
    redirect_uri,
    scopes,
    prompt,
    include_granted_scopes: true,
    state: auth.state,
    ...auth.pkce,
  });

  // redirect to bn2.me
  redirect(url);
}
