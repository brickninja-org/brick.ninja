import type { ReviewQueue } from '@brickninja-org/database';

import { Prisma, ReviewState } from '@brickninja-org/database';

import { db } from '@/lib/prisma';

export async function getRandomReviewId(queue: ReviewQueue, skip?: string): Promise<string | undefined> {
  const where: Prisma.ReviewWhereInput = { queue, state: ReviewState.Open, id: { not: skip }};
  const count = await db.review.count({ where });

  if (count === 0) {
    return undefined;
  }

  const review = await db.review.findFirst({
    where,
    take: 1,
    skip: Math.floor(Math.random() * count),
    select: { id: true },
  });

  if (!review) {
    return undefined;
  }

  return review.id;
}
