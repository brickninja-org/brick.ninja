import type { Prisma } from '@brickninja-org/database';
import type { FormState } from '@/components/form/Form';

import { Input, Select, SelectItem } from '@heroui/react';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { cache } from '@/lib/cache';
import { getUser } from '@/lib/get-user';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { Form } from '@/components/form/Form';
import { SubmitButton } from '@/components/form/SubmitButton';
import { PageLayout } from '@/components/layout/PageLayout';
import { ensureUserIsAdmin } from '../admin';

const getJobsTypes = cache(async () => {
  const jobs = await db.job.findMany({ select: { type: true }, distinct: ['type'], orderBy: { type: 'asc' }});
  return jobs.map((j) => ({ key: j.type, label: j.type }));
}, ['get-job-types'], { revalidate: 60 });

export default async function AdminQueueJobPage() {
  await ensureUserIsAdmin();

  const jobs = await getJobsTypes();

  return (
    <PageLayout>
      <Headline id="apps">Queue Job</Headline>

      <Form id="queue" action={submit}>
        <Select
          className="max-w-xs"
          items={jobs}
          label="Type"
          name="type"
          placeholder="Select a job type"
        >
          {(job) => <SelectItem>{job.label}</SelectItem>}
        </Select>

        <Input
          className="max-w-xs"
          label="Data"
          name="data"
          defaultValue="{}"/>

        <FlexRow>
          <SubmitButton>Queue</SubmitButton>
        </FlexRow>
      </Form>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Jobs',
});

export async function submit(_: FormState, payload: FormData): Promise<FormState> {
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
