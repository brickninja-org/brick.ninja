import type { Prisma } from '@brickninja-org/database';
import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { Button, Input, Select, SelectItem } from '@heroui/react';
import { Form } from '@brickninja-org/ui/components/form/Form';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';

import { cache } from '@/lib/cache';
import { getUser } from '@/lib/get-user';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { PageLayout } from '@/components/layout/PageLayout';
import { ensureUserIsAdmin } from '../admin';

const getJobsTypes = cache(async () => {
  const jobs = await db.job.findMany({ select: { type: true }, distinct: ['type'], orderBy: { type: 'asc' }});
  return jobs.map((j) => j.type);
}, ['get-job-types'], { revalidate: 60 });

export default async function AdminQueueJobPage() {
  await ensureUserIsAdmin();

  const jobs = await getJobsTypes();

  return (
    <PageLayout>
      <Headline id="apps">Queue Job</Headline>
      <Form action={submit}>
        <Select
          className="max-w-xs"
          items={jobs.map((job) => ({ value: job, label: job }))}
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
          <Button type="submit">Queue</Button>
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
