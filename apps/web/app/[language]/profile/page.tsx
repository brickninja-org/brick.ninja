import { cache, Suspense } from 'react';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Skeleton } from '@heroui/react';

import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { ExternalLink } from '@brickninja-org/ui/components/link/ExternalLink';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { getUser } from '@/lib/get-user';
import { createMetadata } from '@/lib/metadata';
import { pageView } from '@/lib/page-view';
import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/layout/HeroLayout';
import { FormatDate } from '@/components/format/FormatDate';
import { Accounts } from './Accounts';

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
      <p>
        You can change your username on your <ExternalLink href="https://bn2me.vercel.app">bn2.me Profile</ExternalLink>.
      </p>

      <Headline id="accounts">Accounts</Headline>
      <Suspense fallback={<Skeleton className="h-4 w-full"/>}>
        <Accounts/>
      </Suspense>

      <Headline id="sessions" actions={<form action={revokeAllSessions}><SubmitButton icon="delete">Revoke all</SubmitButton></form>}>Sessions</Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Session</Table.HeaderCell>
            <Table.HeaderCell>Started</Table.HeaderCell>
            <Table.HeaderCell>Last Active</Table.HeaderCell>
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

export const generateMetadata = createMetadata(async () => {
  const { user } = await getUserData();

  return {
    title: user.name,
  };
});

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
