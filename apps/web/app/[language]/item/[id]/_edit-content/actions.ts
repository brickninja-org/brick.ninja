'use server';

import { ReviewState } from '@brickninja-org/database';

import { db } from '@/lib/prisma';
import { getUser } from '@/lib/get-user';

import { EditContentSubmitError, type CanSubmitResponse } from './types';

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
