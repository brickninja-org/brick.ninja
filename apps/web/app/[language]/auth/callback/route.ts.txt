import { isNotFoundError } from 'next/dist/client/components/not-found';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { userAgent, type NextRequest } from 'next/server';

import { authCookie } from '@/lib/auth/cookie';
import { bn2me } from '@/lib/bn2me';
import { expiresAtFromExpiresIn } from '@/lib/expires-at-from-expires-in';
import { getUser } from '@/lib/get-user';
import { getReturnToUrlFromCookie } from '@/lib/login-url';
import { db } from '@/lib/prisma';
import { getCurrentUrl } from '@/lib/url';

export async function GET(request: NextRequest) {
  try {
    // get code from querystring
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      console.log('Code missing');
      redirect('/login?error');
    }

    // build callback url
    const callbackUrl = new URL('/auth/callback', getCurrentUrl());

    const token = await bn2me.getAccessToken({ code, redirect_uri: callbackUrl.toString() });
    const { user } = await bn2me.api(token.access_token).user();

    // build provider key
    const provider = { provider: 'bn2.me', providerAccountId: user.id };

    // try to find this account in db
    const { userId } = await db.userProvider.upsert({
      where: { provider_providerAccountId: provider },
      create: {
        ...provider,
        displayName: user.name,
        accessToken: token.access_token,
        accessTokenExpiresAt: expiresAtFromExpiresIn(token.expires_in),
        refreshToken: token.refresh_token,
        scope: token.scope.split(' '),
        user: { create: { name: user.name, email: user.email }}
      },
      update: {
        displayName: user.name,
        accessToken: token.access_token,
        accessTokenExpiresAt: expiresAtFromExpiresIn(token.expires_in),
        refreshToken: token.refresh_token,
        scope: token.scope.split(' ')
      }
    });

    // reuse existing session (when reauthorizing)
    const existingSession = await getUser();
    if (existingSession) {
      if (existingSession.id === userId) {
        // the existing session was for the same user and we can reuse it
        redirect(getReturnToUrlFromCookie());
      } else {
        // just logged in with a different user - lets delete the old session
        await db.userSession.delete({ where: { id: existingSession.sessionId }});
      }
    }

    // we couldn't reuse an existing session (doesn't exist or different user), so we have to create a new one...

    // parse user-agent to set session name
    const ua = userAgent(request);
    const sessionName = ua ? `${ua.browser.name} on ${ua.os.name}` : 'Session';

    // create new session
    const session = await db.userSession.create({ data: { info: sessionName, userId }});

    // send response with session cookie
    cookies().set(authCookie(session.id, callbackUrl.protocol === 'https:'));
    redirect(getReturnToUrlFromCookie());
  } catch (error) {
    if (isRedirectError(error) || isNotFoundError(error)) {
      throw error;
    }

    console.error(error);
    redirect('/login?error');
  }
}
