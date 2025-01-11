import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

// import { Scope } from '@bn2me/client/src/types';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/submit-button';
import { Headline } from '@brickninja-org/ui/components/headline';
import { Notice } from '@brickninja-org/ui/components/notice';
import { Icon } from '@brickninja-org/ui/icons';

// import { bn2me } from '@/lib/bn2me';
import { getUser } from '@/lib/get-user';
import { getReturnToUrl, setReturnToUrlCookie } from '@/lib/login-url';
import { HeroLayout } from '@/components/layout/hero-layout';
import { getAlternateUrls /*, getCurrentUrl */ } from '@/lib/url';
import type { PageProps } from '@/lib/next';

export default async function LoginPage({ searchParams }: PageProps) {
  const { returnTo: returnToParam, /* scopes: scopesParam, */ error, logout } = await searchParams;
  const user = await getUser();
  const returnTo = Array.isArray(returnToParam) ? returnToParam[0] : returnToParam;
  // const scopes = Array.isArray(searchParams.scopes) ? searchParams.scopes.join(',') : searchParams.scopes;

  if (user) {
    redirect(getReturnToUrl(returnTo));
  }

  return (
    <HeroLayout hero={<Headline id="login">Login</Headline>}>
      {error !== undefined && (
        <Notice type="error">Unknown error</Notice>
      )}

      {logout !== undefined && (
        <Notice>Logout successful</Notice>
      )}

      <p className="mb-[1.5em]">
        Login to contribute to brick.ninja and to view your collection, and more.
      </p>

      <form action={redirectToBnMe.bind(null, returnTo /*, searchParams.scopes */)}>
        <SubmitButton icon={<Icon icon="lock-open"/>}>Login with bn.me</SubmitButton>
      </form>

      <div className="flex items-center gap-2 mt-8 py-3 px-4 border rounded-sm">
        <Icon icon="cookie"/>
        <p>By logging in you accept that brick.ninja will store cookies in your browser.</p>
      </div>
    </HeroLayout>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: 'Login',
    alternates: getAlternateUrls('/login', language),
  };
}

// eslint-disable-next-line require-await
async function redirectToBnMe(returnTo?: string /*, additionalScopes?: string */) {
  'use server';

  // build redirect URL
  // const redirect_uri = new URL('/auth/callback', getCurrentUrl()).toString();

  // get scopes to request from bn.me
  // const scopes = getScopesFromString(additionalScopes);

  // get bn.me auth url
  const url = ''; // bn2me.getAuthorizationUrl({ redirect_uri, scopes, include_granted_scopes: true });

  // set cookie with url to return after auth
  setReturnToUrlCookie(returnTo);

  // redirect to bn.me
  redirect(url);
}

/*
function getScopesFromString(scopeString?: string) {
  // valid scope values to validate the provided scopes against
  const validScopes: string[] = Object.values(Scope);

  // default scopes that are always requested
  const scopes = new Set([Scope.Identify]);

  // parse scopes
  const parsedScopes = scopeString?.split(',') ?? [];

  // add all valid scopes to the scopes set
  for (const scope of parsedScopes) {
    if (validScopes.includes(scope)) {
      scopes.add(scope as Scope);
    }
  }

  // return the array of scopes to request
  return Array.from(scopes);
}
*/
