import type { Scope } from '@bn2me/client';

import { getCurrentUrl } from '@/lib/url';

export async function getLoginUrlWithReturnTo(scopes?: Scope[]) {
  const url = await getCurrentUrl();

  const parameters = new URLSearchParams();
  parameters.append('returnTo', url.pathname);

  if(scopes) {
    parameters.append('scopes', scopes.join(','));
  }

  return `/login?${parameters.toString()}`;
}

export function getReturnToUrl(returnTo?: string | undefined | null) {
  return isValidReturnTo(returnTo) ? returnTo : '/profile';
}

export function isValidReturnTo(returnTo: string | undefined | null): returnTo is string {
  // ensure returnTo is a relative url, but not protocol relative
  return !!returnTo && returnTo[0] === '/' && (returnTo.length === 1 || returnTo[1] !== '/');
}
