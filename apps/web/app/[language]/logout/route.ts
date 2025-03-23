import type { NextRequest } from 'next/server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { authCookie, authCookieSettings, SessionCookieName } from '@/lib/auth/cookie';
import { db } from '@/lib/prisma';
import { getCurrentUrl } from '@/lib/url';

export async function POST() {
  const cookieStore = await cookies();
  if (!cookieStore.has(SessionCookieName)) {
    // if there is no session cookie, redirect user to login page
    redirect('/login');
  }

  const sessionId = cookieStore.get(SessionCookieName)!.value;
  if (sessionId) {
    await db.userSession.deleteMany({ where: { id: sessionId }});
  }

  // delete cookie
  cookieStore.delete(authCookieSettings);

  // set logout cookie to show message
  cookieStore.set('logout', '1', { maxAge: 2, httpOnly: true, path: '/login', secure: true });

  // redirect to login page
  return redirect('/login');
}
