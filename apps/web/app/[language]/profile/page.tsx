import { cache } from 'react';
import { redirect } from 'next/navigation';

import { FlexRow } from '@brickninja-org/ui/components/flex-row';
import { Headline } from '@brickninja-org/ui/components/headline';
import { Table } from '@brickninja-org/ui/components/table';

import { HeroLayout } from '@/components/layout/hero-layout';
import { getUser } from '@/lib/get-user';
import { db } from '@/lib/prisma';

const getUserData = cache(async () => {
  const session = await getUser();

  if (!session) {
    redirect('/login');
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: {
      sessions: { orderBy: { lastUsed: 'desc' }},
      providers: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return {
    sessionId: session.sessionId,
    user,
  };
});

export default async function ProfilePage() {
  const { sessionId, user } = await getUserData();

  return (
    <HeroLayout hero={<Headline id="profile">{user.name}</Headline>} toc>
      <FlexRow align="between">
        Buttons here...
      </FlexRow>

      <Headline id="accounts">Accounts</Headline>

      <Headline id="sessions">Sessions</Headline>
      <Table>
        <thead>
          <tr>
            <th>Session</th>
            <th>Started</th>
            <th>Last Active</th>
          </tr>
        </thead>
      </Table>
    </HeroLayout>
  );
}
