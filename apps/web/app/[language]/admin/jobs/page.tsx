import type { Prisma } from '@brickninja-org/database';
import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { Form } from '@brickninja-org/ui/components/form/Form';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Label } from '@brickninja-org/ui/components/form/Label';
import { TextInput } from '@brickninja-org/ui/components/form/TextInput';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { SubmitButton } from '@brickninja-org/ui/components/form/buttons/SubmitButton';

import { getUser } from '@/lib/get-user';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { PageLayout } from '@/components/layout/PageLayout';
import { ensureUserIsAdmin } from '../admin';

export default async function AdminQueueJobPage() {
  await ensureUserIsAdmin();

  return (
    <PageLayout>
      <Headline id="apps">Queue Job</Headline>
      <Form action={submit}>
        <Label label="Type"><TextInput name="type"/></Label>

        <Label label="Data"><TextInput name="data" defaultValue="{}"/></Label>

        <FlexRow>
          <SubmitButton>Queue</SubmitButton>
        </FlexRow>
      </Form>
    </PageLayout>
  );
}

async function submit(_: FormState, payload: FormData): Promise<FormState> {
  'use server';

  const user = await getUser();
  if(!user || !user.roles.includes('Admin')) {
    return { error: 'Not authorized' };
  }

  const type = payload.get('type');
  const rawData = payload.get('data');

  if(typeof type !== 'string') {
    return { error: 'Invalid type' };
  }
  if(typeof rawData !== 'string') {
    return { error: 'Invalid data' };
  }

  let data: Prisma.JsonObject;

  try {
    data = JSON.parse(rawData);
  } catch {
    return { error: 'Invalid data' };
  }

  await db.job.create({
    data: {
      type,
      data,
    }
  });

  return { success: 'Queued' };
}

export const generateMetadata = createMetadata({
  title: 'Jobs',
});
