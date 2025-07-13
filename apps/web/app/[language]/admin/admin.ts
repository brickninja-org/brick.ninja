import { notFound } from 'next/navigation';

import { getUser } from '@/lib/get-user';

export async function ensureUserIsAdmin() {
  const user = await getUser();

  if (!user || !user.roles.includes('Admin') || user.name !== 'brick.ninja') {
    notFound();
  }
}
