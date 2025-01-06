import { db } from '@/lib/prisma';
import { getCurrentUrl } from '@/lib/url';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { authCookie, SessionCookieName } from '@/lib/auth/cookie';

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(SessionCookieName)?.value ?? '';

  if (sessionId) {
    await db.userSession.deleteMany({ where: { id: sessionId }});
  }

  (await cookies()).delete(authCookie('', (await getCurrentUrl()).protocol === 'https:'));

  return redirect('/login?logout');
}
