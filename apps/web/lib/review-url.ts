import type { ReviewQueue } from '@brickninja-org/database';

const reviewUrls: Record<ReviewQueue, string> = {
  'ContainerContent': 'container-content',
};

export function getReviewUrlKeyFromQueue(queue: ReviewQueue) {
  return reviewUrls[queue];
}
