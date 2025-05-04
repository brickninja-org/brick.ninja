'use server';

import type { EditContentOrder } from 'app/[language]/item/[id]/_edit-content/types';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { ReviewQueue, ReviewState, UserRole } from '@brickninja-org/database';

import { getUser } from '@/lib/get-user';
import { db } from '@/lib/prisma';
import { getRandomReviewId } from '../../random';

export async function approve(data: FormData) {
  const { id, user, review } = await getUserAndReview(data);
  const { removedItems, addedItems } = review.changes as unknown as EditContentOrder;

  if (!review.relatedItemId) {
    redirect(`/review/container-content/${id}?error`);
  }

  const containerItemId = review.relatedItemId;

  await db.$transaction([
    // remove item contents
    db.content.deleteMany({ where: { containerItemId, contentItemId: { in: removedItems }}}),

    // add new item contents
    db.content.createMany({
      data: addedItems.map(({ item, quantity }) => ({
        containerItemId,
        contentItemId: item.id,
        quantity,
      })),
    }),

    // approve review
    db.review.update({
      where: { id },
      data: { reviewerId: user.id, reviewedAt: new Date(), state: ReviewState.Approved },
    }),
  ]);

  revalidateTag('open-reviews');

  const nextId = await getRandomReviewId(ReviewQueue.ContainerContent);

  redirect(nextId ? `/review/container-content/${nextId}` : '/review');
}

export async function reject(data: FormData) {
  const { id, user } = await getUserAndReview(data);

  await db.review.update({
    where: { id },
    data: { reviewerId: user.id, reviewedAt: new Date(), state: ReviewState.Rejected },
  });

  revalidateTag('open-reviews');

  const nextId = await getRandomReviewId(ReviewQueue.ContainerContent);

  redirect(nextId ? `/review/container-content/${nextId}` : '/review');
}

async function getUserAndReview(data: FormData) {
  const id = data.get('id')?.toString();
  if (!id) {
    redirect('/review');
  }

  const [user, review] = await Promise.all([
    getUser(),
    db.review.findUnique({ where: { id }}),
  ]);
  if (!user) {
    redirect('/login');
  }
  if (!review) {
    redirect('/review/container-content');
  }
  if (review.state !== ReviewState.Open || (review.requesterId === user.id && !user.roles.includes(UserRole.Admin))) {
    redirect(`/review/container-content/${id}?error`);
  }

  return { id, user, review };
}
