import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import type { UserRole } from '@brickninja-org/database';

import { db } from '@/lib/prisma';

export interface SessionUser {
  sessionId: string;
  id: string;
  name: string;
  roles: UserRole[];
}

export const getUser = cache(async function getUser(): Promise<SessionUser | undefined> {
  const sessionId = (await headers()).get('x-bn-session');
  const session = await getSessionFromDb(sessionId);

  if (sessionId && !session) {
    redirect('/logout');
  }

  return session ? { ...session.user, sessionId: sessionId! } : undefined;
});

async function getSessionFromDb(sessionId: string | null) {
  if (!sessionId) {
    return undefined;
  }

  const update = await db.userSession.updateMany({
    where: { id: sessionId },
    data: { lastUsed: new Date() },
  });

  if (update.count === 1) {
    return db.userSession.findUnique({
      where: { id: sessionId },
      select: { user: { select: { id: true, name: true, roles: true }}}
    }) ?? undefined;
  }

  return undefined;
}
