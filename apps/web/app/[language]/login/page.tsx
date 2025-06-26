import type { Metadata } from 'next';
import type { PageProps } from '@/lib/next';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Scope } from '@bn2me/client';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { Icon } from '@brickninja-org/ui/icons';

import { getUser } from '@/lib/get-user';
import { getReturnToUrl } from '@/lib/login-url';
import { getAlternateUrls } from '@/lib/url';
import { LoginButton } from './Login.client';
import { Translate } from '@/components/i18n/Translate';
import { PageLayout } from '@/components/layout/PageLayout';
import { translateMany } from '@/lib/translate';

export default async function LoginPage({ searchParams, params }: PageProps) {
  const { language } = await params;
  const { returnTo: returnToParam, scopes: scopesParam, error } = await searchParams;
  const returnTo = Array.isArray(returnToParam) ? returnToParam[0] : returnToParam;

  // get user
  const user = await getUser();

  // if the user already has a session, redirect to the returnTo URL
  if (user) {
    redirect(getReturnToUrl(returnTo));
  }

  // parse scopes
  const scopes = parseScopesOrDefault(scopesParam);

  // check if cookie exist to show logout message
  const cookieStore = await cookies();
  const showLogoutMessage = cookieStore.has('logout');

  return (
    <PageLayout>
      <div className="max-w-[560px] mx-auto mb-8 py-6 px-8 shadow-base border-x border-b border-(--color-border-dark) rounded-[0_0_2px_2px] overflow-hidden">
        {error !== undefined && (
          <Notice type="error">Unknown error {error.toString()}</Notice>
        )}

        {showLogoutMessage && (
          <Notice><Translate id="logout.success"/></Notice>
        )}

        <Headline id="login"><Translate id="login"/></Headline>
        <p className="mb-[1.5em]">
          Login to contribute to brick.ninja and to view your collection, and more.
        </p>
        <LoginButton
          scopes={scopes}
          returnTo={returnTo}
          logout={showLogoutMessage}
          translations={translateMany(['login.button', 'login.grant-all', 'login.grant-all.hint'], language)}/>
        <div className="flex items-center gap-4 mt-8 -mb-6 -mx-8 py-3 px-8 border-t border-(--color-border-dark) bg-background-light text-[15px] text-muted">
          <Icon icon="cookie"/>
          <p><Translate id="login.cookies"/></p>
        </div>
      </div>
    </PageLayout>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;

  return {
    title: 'Login',
    alternates: getAlternateUrls('/login', language),
  };
}

const validScopes = new Set(Object.values(Scope));

function parseScopesOrDefault(scope: string | string[] | undefined): Scope[] {
  if (!scope) {
    return[ Scope.Identify];
  }

  // parse scopes
  const parsedScopes = (Array.isArray(scope) ? scope : [scope])
    .flatMap((value) => value.split(','))
    .filter((scope): scope is Scope => validScopes.has(scope as Scope));

  // create set to deduplicate scopes
  const scopes = new Set(parsedScopes);

  // ensure Identify is always included
  scopes.add(Scope.Identify);

  // make sure account displays names are included if accounts are included
  if (scopes.has(Scope.Accounts) || scopes.values().some((scope) => scope.startsWith('bn2:'))) {
    scopes.add(Scope.Accounts_DisplayName);
  }

  return Array.from(scopes);
}
