import Link from 'next/link';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { List } from '@brickninja-org/ui/components/layout/List';

import { getUser } from '@/lib/get-user';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/layout/HeroLayout';

async function getApplications() {
  const user = await getUser();

  const applications = user
    ? await db.application.findMany({ where: { ownerId: user.id }})
    : [];

  return { user, applications };
}

export default async function DeveloperPage() {
  const { user, applications } = await getApplications();

  return (
    <HeroLayout hero={<Headline id="developer">Developer</Headline>} color="red" toc>
      <Headline id="services">Services</Headline>
      <List>
        <li><strong><Link href="https://bn2.me/">bn2.me</Link></strong>: Auth service for your applications</li>
      </List>

      <Headline id="api">API</Headline>
      <List>
        <li><strong><Link href="/dev/api">API</Link></strong>: API provider by brick.ninja</li>
      </List>

      {user && (
        <>
          <Headline
            id="applications"
            actions={<LinkButton icon="add" href="/dev/app/create">Create Application</LinkButton>}
          >
            Your applications
          </Headline>

          <List>
            {applications.length === 0 && (
              <li>You have no applications</li>
            )}
            {applications.map(({ id, name }) => (
              <li key={id}><Link href={`/dev/app/${id}`}>{name}</Link></li>
            ))}
          </List>
        </>
      )}
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Developer Resources',
});
