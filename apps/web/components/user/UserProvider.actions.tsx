'use server';

import { cookies } from "next/headers";

import { authCookie, expiresIn } from "@/lib/auth/cookie";
import { expiresAtFromExpiresIn } from "@/lib/expires-at-from-expires-in";
import { getUser } from "@/lib/get-user";
import { db } from "@/lib/prisma";

export async function extendUserSessionAction() {
  const user = await getUser();
  if (!user) {
    throw new Error('Can\'t extend non existing session');
  }

  console.log(`[UserProvider.action] Extending session ${user.session.id} for ${user.name} (${user.id})`);

  // calculate new expiresAt timestamp
  const newExpiresAt = expiresAtFromExpiresIn(expiresIn);

  // update expiresAt in db
  // TODO: start a new session instead?
  await db.userSession.update({
    where: { id: user.session.id },
    data: { expiresAt: newExpiresAt },
  });

  // extend cookie lifetime
  const cookieStore = await cookies();
  cookieStore.set(authCookie(user.session.id, newExpiresAt));
}
