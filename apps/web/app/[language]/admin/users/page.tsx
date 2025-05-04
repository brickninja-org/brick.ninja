import { cache } from 'react';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';
import { Icon } from '@brickninja-org/ui/icons';

import { db } from '@/lib/prisma';
import { ensureUserIsAdmin } from '../admin';
import { FormatDate } from '@/components/format/FormatDate';
import { PageLayout } from '@/components/layout/PageLayout';
import { ColumnSelect } from '@/components/table/ColumnSelect';

const getUsers = cache(() => {
  return db.user.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      sessions: { take: 1, orderBy: { lastUsedAt: 'desc' }, select: { lastUsedAt: true }},
      providers: { select: { scope: true }, take: 1 }
    }
  });
});

export default async function AdminUserPage() {
  await ensureUserIsAdmin();

  const users = await getUsers();
  const Users = createDataTable(users, (user) => user.id);

  return (
    <PageLayout>
      <Headline id="users" actions={<ColumnSelect table={Users}/>}>Users ({users.length})</Headline>

      <Users.Table>
        <Users.Column id="name" title="Username" sortBy="name">{({ name }) => name}</Users.Column>
        <Users.Column id="email" title="Email" sortBy="email">{({ email, emailVerified }) => <FlexRow>{email}{emailVerified && <Icon icon="checkmark"/>}</FlexRow>}</Users.Column>
        <Users.Column id="roles" title="Roles" sortBy={({ roles }) => roles.length}>{({ roles }) => roles.join(', ')}</Users.Column>
        <Users.Column id="scopes" title="Scopes" hidden>{({ providers }) => <FlexRow wrap>{providers[0].scope.map((scope) => <span key={scope} style={{ backgroundColor: 'var(--color-background-light)', paddingInline: 8, borderRadius: 2, border: '1px solid var(--color-border-dark)', fontSize: 14 }}>{scope}</span>)}</FlexRow>}</Users.Column>
        <Users.Column id="bn2" title="BN2 Linked">{({ providers }) => <Icon icon={providers[0].scope.includes('accounts') ? 'checkmark' : 'cancel'}/>}</Users.Column>
        <Users.Column id="createdAt" title="Created At" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Users.Column>
        <Users.Column id="session" title="Last access" sortBy={({ sessions }) => sessions[0]?.lastUsedAt}>{({ sessions }) => sessions.length > 0 ? <FormatDate date={sessions[0].lastUsedAt}/> : '-'}</Users.Column>
      </Users.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Users'
};
