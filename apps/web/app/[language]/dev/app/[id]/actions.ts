'use server';

import type { FormState } from '@brickninja-org/ui/components/form/Form';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getUser } from '@/lib/get-user';
import { getLoginUrlWithReturnTo } from '@/lib/login-url';
import { db } from '@/lib/prisma';

export async function deleteApplication(id: string) {
  const user = await getUser();
  if (!user) {
    redirect(await getLoginUrlWithReturnTo());
  }

  await db.application.deleteMany({ where: { id, ownerId: user.id }});

  redirect('/dev#applications');
}

export async function saveApplication(id: string, prev: FormState, data: FormData): Promise<FormState> {
  const user = await getUser();

  if (!user) {
    redirect(await getLoginUrlWithReturnTo());
  }

  const name = data.get('name');
  if (!name || typeof name !== 'string') {
    return { error: 'Invalid name' };
  }

  await db.application.update({ where: { id }, data: { name }});

  revalidatePath(`/dev/app/${id}`);
  return { success: 'Application saved' };
}

export async function updateOrigins(id: string, prev: FormState, data: FormData): Promise<FormState> {
  const user = await getUser();
  if (!user) {
    redirect(await getLoginUrlWithReturnTo());
  }

  const application = await db.application.findUnique({ where: { id }, select: { origins: true }});
  if (!application) {
    return { error: 'Application not found' };
  }

  const origin = data.get('origin');
  const originToDelete = data.get('delete');

  const hasNewOrigin = origin !== null && typeof origin === 'string';
  const hasDeleteOrigin = originToDelete !== null && typeof origin === 'string';
  if (!hasNewOrigin && !hasDeleteOrigin) {
    return { error: 'Bad request' };
  }
  if (hasDeleteOrigin) {
    const updateOrigins = application.origins.filter((origin) => origin !== originToDelete);

    if (updateOrigins.length === application.origins.length) {
      return { error: 'Origin to delete not found' };
    }

    await db.application.update({
      where: { id },
      data: { origins: updateOrigins },
    });
  } else if (hasNewOrigin) {
    let url;
    try {
      url = new URL(origin);
    } catch {
      return { error: 'Wrong format. Please provide the origin format <schema>://<domain>(:<port>)' };
    }

    const formattedOrigin = url.origin;

    if (application.origins.includes(formattedOrigin)) {
      return { error: 'Duplicte origin' };
    }

    await db.application.update({
      where: { id },
      data: { origins: { push: formattedOrigin }},
    });
  }

  revalidatePath(`/dev/app/${id}`);
  return { success: 'Application saved' };
}
