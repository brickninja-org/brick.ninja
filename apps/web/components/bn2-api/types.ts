import type { Scope } from '@bn2me/client';

export enum ErrorCode {
  NOT_LOGGED_IN = 'NOT_LOGGED_IN',
  MISSING_PERMISSION = 'MISSING_PERMISSION',
  REAUTHORIZE = 'REAUTHORIZE',
}

export type ErrorResponse = {
  error: ErrorCode;
};

export interface Bn2Account {
  id: string;
  name: string;
  verified?: boolean;
  displayName?: string | null;
}

export interface Bn2AccountWithHidden extends Bn2Account {
  hidden: boolean;
}

export type FetchAccountSuccessResponse = {
  error: undefined;
  accounts: Bn2Account[];
  scopes: Scope[];
};

export type FetchAccountResponse = ErrorResponse | FetchAccountSuccessResponse;

export type FetchAccessTokenResponse = ErrorResponse | {
  error: undefined,
  accessTokens: Record<string, AccessToken>,
};

export type AccessToken = {
  accessToken: string;
  expiresAt: Date;
};
