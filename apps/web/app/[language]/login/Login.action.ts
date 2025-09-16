'use server';

import 'server-only';

import type { PKCEChallenge } from '@bn2me/client/pkce';

import { redirect } from 'next/navigation';
import { randomBytes } from 'crypto';
import { Scope } from '@bn2me/client';
import { generatePKCEPair } from '@bn2me/client/pkce';

import { bn2me } from '@/lib/bn2me';
import { expiresAtFromExpiresIn } from '@/lib/expires-at-from-expires-in';
import { isValidReturnTo } from '@/lib/login-url';
import { db } from '@/lib/prisma';
import { getCurrentUrl } from '@/lib/url';

export async function redirectToBn2Me(returnTo?: string, additionalScopes?: string) {
  // build redirect url
  const redirect_uri = new URL('/auth/callback', await getCurrentUrl()).toString();

  // get scopes to request from bn2.me
  const scopes = getScopesFromString(additionalScopes);

  // prepare auth
  const auth = await prepareAuthRequest(returnTo);

  // get bn2.me auth url
  const url = bn2me.getAuthorizationUrl({
    scopes,
    redirect_uri,
    include_granted_scopes: true,
    state: auth.state,
    ...auth.pkce,
  });

  // redirect to bn2.me
  redirect(url);
}

interface AuthRequest {
  state: string,
  pkce: PKCEChallenge,
}

export async function prepareAuthRequest(returnTo?: string): Promise<AuthRequest> {
  const pkce = await generatePKCEPair();
  const state = await randomBytes(16).toString('base64url');

  // add expiration in 60 minutes
  const expiresAt = expiresAtFromExpiresIn(60 * 60);

  // store generated authorization request in db
  await db.authorizationRequest.create({
    data: {
      state,
      code_verifier: pkce.code_verifier,
      returnTo: isValidReturnTo(returnTo) ? returnTo : undefined,
      expiresAt,
    },
  });

  return {
    state,
    pkce: pkce.challenge,
  };
}

function getScopesFromString(scopeString?: string) {
  // valid scope values to validate the provided scopes against
  const validScopes: string[] = Object.values(Scope);

  // default scopes that are always requested
  const scopes = new Set([Scope.Identify]);

  // parse scopes
  const parsedScopes = scopeString?.split(' ') ?? [];

  // add all valid scopes to the scopes set
  for (const scope of parsedScopes) {
    if (validScopes.includes(scope)) {
      scopes.add(scope as Scope);
    }
  }

  // return the array of scopes to request
  return Array.from(scopes);
}
