import { cache } from 'react';
import Link from 'next/link';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';

import { db } from '@/lib/prisma';
import { getReviewUrlKeyFromQueue } from '@/lib/review-url';
import { FormatDate } from '@/components/format/FormatDate';
import { PageLayout } from '@/components/layout/PageLayout';
import { ensureUserIsAdmin } from '../admin';

const getReviews = cache(() => {
  return db.review.findMany({
    include: {
      requester: { select: { name: true }},
      reviewer: { select: { name: true }},
    },
    orderBy: { updatedAt: 'desc' },
    take: 500,
  });
});

export default async function AdminReviewsPage() {
  await ensureUserIsAdmin();
  const reviews = await getReviews();
  const Reviews = createDataTable(reviews, ({ id }) => id);

  return (
    <PageLayout>
      <Headline id="reviews">Reviews ({reviews.length})</Headline>
      <Reviews.Table>
        <Reviews.Column id="queue" title="Queue" sortBy="queue">{({ id, queue }) => <Link href={`/review/${getReviewUrlKeyFromQueue(queue)}/${id}`}>{queue}</Link>}</Reviews.Column>
        <Reviews.Column id="state" title="State" sortBy="state">{({ state }) => state}</Reviews.Column>
        <Reviews.Column id="requester" title="Created by" sortBy="requesterId">{({ requester }) => requester?.name}</Reviews.Column>
        <Reviews.Column id="createdAt" title="Created at" sortBy="createdAt">{({ createdAt }) => <FormatDate date={createdAt}/>}</Reviews.Column>
        <Reviews.Column id="reviewer" title="Reviewed by" sortBy="reviewerId">{({ reviewer }) => reviewer?.name}</Reviews.Column>
        <Reviews.Column id="reviewedAt" title="Reviewed at" sortBy="reviewedAt">{({ reviewedAt }) => <FormatDate date={reviewedAt}/>}</Reviews.Column>
      </Reviews.Table>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Reviews',
};
