import { cache, Suspense } from 'react';
import { redirect } from 'next/navigation';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';
// import { Table } from '@brickninja-org/ui/components/table/Table';

import { getUser } from '@/lib/get-user';
import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/layout/HeroLayout';
import { pageView } from '@/lib/page-view';
import { FormatDate } from '@/components/format/FormatDate';
import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { ExternalLink } from '@brickninja-org/ui/components/link/ExternalLink';
import { Skeleton } from '@/components/skeleton/Skeleton';
import { Table, TableBody, TableColumn, TableColumnHeader, TableHeader, TableRow } from '@/components/table/StaticTable';
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
      <Suspense fallback={<Skeleton/>}>
        <Accounts/>
      </Suspense>

      <Headline id="sessions" actions={<form action={revokeAllSessions}><SubmitButton icon="delete">Revoke all</SubmitButton></form>}>Sessions</Headline>
      <Table>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Session</TableColumnHeader>
            <TableColumnHeader>Started</TableColumnHeader>
            <TableColumnHeader>Last Active</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user.sessions.map((session) => (
            <TableRow key={session.id}>
              <TableColumn>{session.info}{session.id === sessionId && ' (Current Session)'}</TableColumn>
              <TableColumn><FormatDate relative date={session.createdAt}/></TableColumn>
              <TableColumn>{session.id === sessionId ? 'now' : <FormatDate relative date={session.lastUsedAt}/>}</TableColumn>
            </TableRow>
          ))}
        </TableBody>
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
