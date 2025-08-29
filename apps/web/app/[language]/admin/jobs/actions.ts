'use server';

import type { Prisma } from '@brickninja-org/database';
import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { getUser } from '@/lib/get-user';
import { db } from '@/lib/prisma';

export async function submit(_: FormState, payload: FormData): Promise<FormState> {
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
