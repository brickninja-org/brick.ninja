import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { Form } from '@brickninja-org/ui/components/form/Form';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';

import { cache } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Scope } from '@bn2me/client';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';

import { getUser } from '@/lib/get-user';
import { db } from '@/lib/prisma';
import { getLoginUrlWithReturnTo } from '@/lib/login-url';
import { reauthorize } from '@/components/bn2-api/reauthorize';
import { PageLayout } from '@/components/layout/PageLayout';

async function createApplication(_: FormState, data: FormData) {
  'use server';

  const name = data.get('name');
  if (typeof name !== 'string' || name.trim().length < 2) {
    return { error: 'Invalid name.' };
  }

  const { user, email } = await getUserAndEmail();
  if (!user) {
    return { error: 'Not logged in.' };
  }
  if (!email?.email || !email.emailVerified) {
    return { error: 'Verified email required.' };
  }

  const application = await db.application.create({
    data: {
      name: name.trim(),
      apiKey: crypto.randomUUID(),
      ownerId: user.id,
    },
  });

  redirect(`/dev/app/${application.id}`);
}

const getUserAndEmail = cache(async function getUserAndEmail() {
  const user = await getUser();
  const email = user
    ? await db.user.findUnique({ where: { id: user.id }, select: { email: true, emailVerified: true }})
    : undefined;

  return { user, email };
});

export default async function DevApplicationCreatePage() {
  const { user, email } = await getUserAndEmail();

  return (
    <PageLayout>
      <Headline id="create-application">Create Application</Headline>
      {!user && (
        <Notice type="warning">You need to <Link href={await getLoginUrlWithReturnTo([Scope.Email])}>Login</Link> to create applications.</Notice>
      )}
      {user && !email?.emailVerified && (
        <form action={reauthorize.bind(null, [Scope.Email], 'consent')}>
          <Notice type="warning">You need to add a verified email address on bn2.me and authorize brick.ninja in order to create applications. <SubmitButton icon="user">Authorize</SubmitButton></Notice>
        </form>
      )}

      <p>You can create applications to access brick.ninja APIs.</p>

      {user && email?.emailVerified && (
        <Form action={createApplication}>
          <Label label="Name">
            <TextInput name="name"/>
          </Label>

          <FlexRow>
            <SubmitButton type="submit" icon="add">Create Application</SubmitButton>
          </FlexRow>
        </Form>
      )}
    </PageLayout>
  );
}
