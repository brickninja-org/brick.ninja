'use server';

import { revalidateTag } from 'next/cache';

import { Prisma, ReviewState } from '@brickninja-org/database';

import { db } from '@/lib/prisma';
import { getUser } from '@/lib/get-user';

import { EditContentSubmitError, type CanSubmitResponse } from './types';

export async function submitToReview({ itemId }: { itemId: number }): Promise<EditContentSubmitError | true> {
  const preConditions = await canSubmit(itemId);

  if (!preConditions.canSubmit) {
    console.log('Can not submit review', preConditions.reason);
    return preConditions.reason;
  }

  const item = await db.item.findUnique({
    where: { id: itemId },
  });

  if (!item) {
    return EditContentSubmitError.ITEM_NOT_FOUND;
  }

  await db.review.create({
    data: {
      state: ReviewState.Open,
      changes: {} as unknown as Prisma.InputJsonValue,
      queue: 'ContainerContent',
      requesterId: preConditions.userId,
      relatedItemId: itemId,
    }
  });

  revalidateTag('open-reviews');

  return true;
}

export async function canSubmit(itemId: number): Promise<CanSubmitResponse> {
  const user = await getUser();

  if (!user) {
    return { canSubmit: false, reason: EditContentSubmitError.LOGIN };
  }

  const pendingReview = await db.review.findFirst({
    where: { queue: 'ContainerContent', relatedItemId: itemId, state: ReviewState.Open },
    select: { id: true, requesterId: true },
  });

  if (pendingReview !== null) {
    return { canSubmit: false, reason: EditContentSubmitError.PENDING_REVIEW, reviewId: pendingReview.id, ownReview: pendingReview.requesterId === 'me' };
  }

  return { canSubmit: true, userId: 'me' };
}
