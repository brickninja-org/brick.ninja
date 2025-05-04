'use server';
import 'server-only';

import type { Scope } from '@bn2me/client';
import type { UserProvider } from '@brickninja-org/database';
import type { FetchAccountResponse, FetchAccessTokenResponse } from './types';

import { bn2me } from '@/lib/bn2me';
import { expiresAtFromExpiresIn } from '@/lib/expires-at-from-expires-in';
import { getUser } from '@/lib/get-user';
import { db } from '@/lib/prisma';

import { ErrorCode } from './types';
import { isDefined } from '@brickninja-org/helper/is';

export async function fetchAccounts(requiredScopes: Scope[]): Promise<FetchAccountResponse> {
  const user = await getUser();

  if (!user) {
    return { error: ErrorCode.NOT_LOGGED_IN };
  }

  const token = await db.userProvider.findFirst({
    where: { userId: user.id, provider: 'bn2.me' },
  });
  if (!token) {
    return { error: ErrorCode.NOT_LOGGED_IN };
  }

  if (requiredScopes.some((scope) => !token.scope.includes(scope))) {
    return { error: ErrorCode.MISSING_PERMISSION };
  }

  const access_token = await ensureActiveAccessToken(token);
  if (!access_token) {
    console.log('Unable to get access token');
    return { error: ErrorCode.REAUTHORIZE };
  }

  let response;
  try {
    response = await bn2me.api(access_token).accounts();
  } catch (e) {
    console.error(e);
    return { error: ErrorCode.REAUTHORIZE };
  }

  return {
    error: undefined,
    accounts: response.accounts,
    scopes: token.scope as Scope[],
  };
}

export async function fetchAccessTokens(accountIds: string[]): Promise<FetchAccessTokenResponse> {
  const user = await getUser();
  if (!user) {
    return { error: ErrorCode.NOT_LOGGED_IN };
  }

  console.log(`[fetchAccessTokens] fetch ${accountIds.length} BN2 API access tokens for ${user.name}`);

  const token = await db.userProvider.findFirst({
    where: { userId: user.id, provider: 'bn2.me' },
  });
  if (!token) {
    return { error: ErrorCode.NOT_LOGGED_IN };
  }

  const bn2meToken = await ensureActiveAccessToken(token);
  if (!bn2meToken) {
    console.log('Unable to get access token');
    return { error: ErrorCode.REAUTHORIZE };
  }

  const api = bn2me.api(bn2meToken);

  const subtokens = await Promise.all(accountIds.map(
    (accountId) => api.subtoken(accountId)
      .then(({ subtoken, expiresAt }) => [accountId, { accessToken: subtoken, expiresAt: new Date(expiresAt) }] as const)
      .catch((e) => {
        console.error(e);
        return undefined;
      }),
  ));

  const responseAsObject = Object.fromEntries(subtokens.filter(isDefined));

  return {
    error: undefined,
    accessTokens: responseAsObject,
  };
}

async function ensureActiveAccessToken({
  accessToken,
  accessTokenExpiresAt,
  refreshToken,
  refreshTokenExpiresAt,
  provider,
  providerAccountId,
}: UserProvider) {
  const now = new Date();

  if (accessToken && (accessTokenExpiresAt === null || accessTokenExpiresAt > now)) {
    return accessToken;
  }

  if (refreshToken && (refreshTokenExpiresAt === null || refreshTokenExpiresAt > now)) {
    const fresh = await bn2me.refreshToken({ refresh_token: refreshToken });

    await db.userProvider.update({
      where: { provider_providerAccountId: { provider, providerAccountId }},
      data: { accessToken: fresh.access_token, accessTokenExpiresAt: expiresAtFromExpiresIn(fresh.expires_in), refreshToken: fresh.refresh_token },
    });

    return fresh.access_token;
  }

  return undefined;
}
