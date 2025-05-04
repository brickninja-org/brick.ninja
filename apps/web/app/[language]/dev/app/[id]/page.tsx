import type { PageProps } from '@/lib/next';

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Button } from '@brickninja-org/ui/components/form/Button';
import { CopyButton } from '@brickninja-org/ui/components/form/buttons/CopyButton';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { ExternalLink } from '@brickninja-org/ui/components/link/ExternalLink';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { getUser } from '@/lib/get-user';
import { getLoginUrlWithReturnTo } from '@/lib/login-url';
import { db } from '@/lib/prisma';
import { PageLayout } from '@/components/layout/PageLayout';
import { deleteApplication, saveApplication, updateOrigins } from './actions';

async function getApplication(id: string) {
  const user = await getUser();
  if (!user) {
    redirect(await getLoginUrlWithReturnTo());
  }

  const application = await db.application.findUnique({
    where: { id, ownerId: user.id },
  });
  if (!application) {
    notFound();
  }

  return application;
}

type DevAppPageProps = PageProps<{ id: string }>;

export default async function DevAppPage({ params }: DevAppPageProps) {
  const { id } = await params;
  const application = await getApplication(id);

  return (
    <PageLayout toc>
      <Headline id="application">{application.name}</Headline>
      <Form action={saveApplication.bind(null, application.id)}>
        <Label label="Name">
          <TextInput defaultValue={application.name} name="name"/>
        </Label>

        <FlexRow>
          <Button type="submit">Save</Button>
          <Button intent="delete" icon="delete" type="submit" formAction={deleteApplication.bind(null, application.id)}>
            Delete Application
          </Button>
        </FlexRow>
      </Form>

      <Headline id="api-key">API Key</Headline>
      <p>
        Use this API key to access the <Link href="/dev/api">brick.ninja API</Link>.
        It is okay to include this API key in native/mobile apps or client-side web applications.
      </p>

      <Label label="API Key">
        <TextInput value={application.apiKey} readOnly/>
        <CopyButton copy={application.apiKey} icon="copy">Copy</CopyButton>
      </Label>

      <Headline id="origins">Origins</Headline>
      <p>
        To access the brick.ninja API directly from a web browser, you&apos;ll need to register
        the <ExternalLink href="https://developer.mozilla.org/en-US/docs/Glossary/Origin">origins</ExternalLink> your
        application uses. This is not required if you are making requests from a server-side environment
        without <ExternalLink href="https://developer.mozilla.org/en-US/docs/Glossary/CORS">CORS</ExternalLink> restrictions.
      </p>
      <Form action={updateOrigins.bind(null, application.id)}>
        <Table>
          <thead>
            <tr>
              <Table.HeaderCell>Origin</Table.HeaderCell>
              <Table.HeaderCell small>Actions</Table.HeaderCell>
            </tr>
          </thead>
          <tbody>
            {application.origins.map((origin) => (
              <tr key={origin}>
                <th>{origin}</th>
                <td><Button type="submit" name="delete" value={origin}>Delete</Button></td>
              </tr>
            ))}
            <tr>
              <td><FlexRow><TextInput name="origin"/></FlexRow></td>
              <td><Button type="submit" icon="add">Add Origin</Button></td>
            </tr>
          </tbody>
        </Table>
      </Form>
    </PageLayout>
  );
}

export async function generateMetadata({ params }: DevAppPageProps) {
  const { id } = await params;
  const application = getApplication(id);

  if(!application) {
    return notFound();
  }

  return {
    title: `Application: ${(await application).name}`
  };
}
