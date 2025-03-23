import { cache } from 'react';
import { redirect } from 'next/navigation';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { getUser } from '@/lib/get-user';
import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/layout/HeroLayout';
import { pageView } from '@/lib/page-view';
import { FormatDate } from '@/components/format/FormatDate';
import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';

const getUserData = cache(async () => {
  const userSession = await getUser();
  if (!userSession) {
    redirect('/login');
  }

  const user = await db.user.findUnique({
    where: { id: userSession.id },
    include: {
      sessions: { orderBy: { lastUsedAt: 'desc' }, where: { expiresAt: { gte: new Date() }}},
      providers: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return {
    sessionId: userSession.session.id,
    user,
  };
});

export default async function ProfilePage() {
  const { sessionId, user } = await getUserData();
  await pageView('profile');

  return (
    <HeroLayout hero={<Headline id="profile">{user.name}</Headline>} toc>
      <FlexRow align="between">
        Buttons here...
      </FlexRow>

      <Headline id="accounts">Accounts</Headline>

      <Headline id="sessions" actions={<form action={revokeAllSessions}><SubmitButton icon="delete">Revoke all</SubmitButton></form>}>Sessions</Headline>
      <Table>
        <thead>
          <tr>
            <th>Session</th>
            <th>Started</th>
            <th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          {user.sessions.map((session) => (
            <tr key={session.id}>
              <td>{session.info}{session.id === sessionId && ' (Current Session)'}</td>
              <td><FormatDate relative date={session.createdAt}/></td>
              <td>{session.id === sessionId ? 'now' : <FormatDate relative date={session.lastUsedAt}/>}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </HeroLayout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const { user } = await getUserData();

  return {
    title: user.name,
  };
}

async function revokeAllSessions() {
  'use server';

  const user = await getUser();

  if (!user) {
    return;
  }

  // delete all sessions except the current in db
  await db.userSession.deleteMany({
    where: { id: { not: user.session.id }, userId: user.id },
  });

  revalidatePath('/profile');
}
