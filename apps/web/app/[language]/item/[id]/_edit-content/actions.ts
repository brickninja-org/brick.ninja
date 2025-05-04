'use server';

import type { Prisma } from '@brickninja-org/database';
import type { CanSubmitResponse, EditContentOrder } from './types';

import { revalidateTag } from 'next/cache';

import { ReviewState } from '@brickninja-org/database';

import { db } from '@/lib/prisma';
import { getUser } from '@/lib/get-user';

import { EditContentSubmitError } from './types';

export async function submitToReview({ itemId, removedItems, addedItems }: { itemId: number } & EditContentOrder): Promise<EditContentSubmitError | true> {
  if (removedItems.length === 0 && addedItems.length === 0) {
    console.log('No changes');
    return EditContentSubmitError.NO_CHANGES;
  }

  const preConditions = await canSubmit(itemId);

  if (!preConditions.canSubmit) {
    console.log('Can not submit review', preConditions.reason);
    return preConditions.reason;
  }

  const item = await db.item.findUnique({
    where: { id: itemId },
    include: {
      contains: true,
    },
  });

  if (!item) {
    return EditContentSubmitError.ITEM_NOT_FOUND;
  }

  const invalidRemovedItems = removedItems.some((removedId) => !item.contains.some(({ contentItemId }) => contentItemId === removedId));
  const invalidAddedItems = !addedItems.every((added) => {
    return (
      // valid quantity
      Number.isInteger(added.quantity) && added.quantity > 0 &&
      // no item added twice
      !addedItems.some(({ _id, item: { id }}) => _id !== added._id && id === added.item.id) &&
      // no item added which is already in contents and not removed
      !item.contains.some(({ contentItemId }) => contentItemId === added.item.id && !removedItems.includes(contentItemId))
    );
  });

  if (invalidRemovedItems || invalidAddedItems) {
    return EditContentSubmitError.VALIDATION_FAILED;
  }

  await db.review.create({
    data: {
      state: ReviewState.Open,
      changes: { removedItems, addedItems } as unknown as Prisma.InputJsonValue,
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

  return { canSubmit: true, userId: user.id };
}
