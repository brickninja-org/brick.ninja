export enum ErrorCode {
  NOT_LOGGED_IN,
  MISSING_PERMISSION,
  REAUTHORIZE,
}

export type ErrorResponse = {
  error: ErrorCode;
};

export type FetchAccountSuccessResonse = {
  errors: undefined;
  accounts: BricklinkAccount[];
  // scopes: Scope[];
};

export interface BricklinkAccount {
  id: string;
  name: string;
  verified?: boolean;
  displayName?: string | null;
}

export interface BricklinkAccountWithHidden extends BricklinkAccount {
  hidden: boolean;
}

export type FetchAccessTokenResponse = ErrorResponse | {
  error: undefined;
  accessToken: Record<string, AccessToken>;
};

export type AccessToken = {
  accessToken: string;
  expiresAt: Date;
};
