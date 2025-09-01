import type { FC } from 'react';
import type { Language, ReviewQueue } from '@brickninja-org/database';

import { Suspense, use } from 'react';
import { Button, Card, CardBody, CardHeader, Chip, Divider, Link, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';

import { groupByUnique } from '@brickninja-org/helper/group-by';
import { Icon } from '@brickninja-org/ui/icons';
import { Translate } from '@/components/i18n/Translate';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';

const getOpenReviews = cache(
  async () => {
    const data = await db.review.groupBy({
      by: ['queue'],
      where: { state: 'Open' },
      _count: true,
    });

    const total = data.reduce((sum, { _count }) => sum + _count, 0);

    return Object.fromEntries([
      ...groupByUnique(data, 'queue').entries().map(([q, { _count }]) => [q, _count]),
      ['_total', total],
    ]) as Record<ReviewQueue | '_total', number>;
  },
  ['open-reviews'],
  { revalidate: 600, tags: ['open-reviews'] },
);

export interface ReviewButtonProps {
  language: Language;
}

export const ReviewButton: FC<ReviewButtonProps> = ({ language }) => {
  return (
    <Suspense fallback={<InternalReviewButton language={language} data={undefined}/>}>
      <InternalReviewButton language={language} data={getOpenReviews()}/>
    </Suspense>
  );
};

interface InternalReviewButtonProps extends ReviewButtonProps {
  data: ReturnType<typeof getOpenReviews> | undefined;
}

const InternalReviewButton: FC<InternalReviewButtonProps> = ({ language, data }) => {
  const reviewCounts = data ? use(data) : undefined;

  const button = (
    <Button radius="sm" variant="light" href="/review" startContent={<Icon icon="review-queue"/>} className="min-w-10 w-10 md:min-w-20 md:w-fit" aria-label="Review">
      <span className="hidden md:block"><Translate language={language} id="review"/><ReviewCountBadge count={reviewCounts?._total} hideEmpty/></span>
    </Button>
  );

  return (
    <Popover offset={8} placement="bottom-end" radius="sm">
      <PopoverTrigger>{button}</PopoverTrigger>
      <PopoverContent className="max-w-[90vw] sm:max-w-[380px] p-0">
        <Card className="w-full max-w-[420px]" radius="sm" shadow="none">
          <CardHeader className="bg-content2 dark:bg-content1">
            <Translate language={language} id="review.description"/>
          </CardHeader>
          <Divider/>
          <CardBody>
            <Button
              as={Link}
              className="flex items-center justify-between gap-4"
              href="/review/container-content"
              radius="sm"
              variant="light"
            >
              <Translate language={language} id="review.queue.ContainerContent"/>
              <ReviewCountBadge count={reviewCounts?.ContainerContent}/>
            </Button>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export interface ReviewCountBadgeProps {
  count: number | undefined;
  hideEmpty?: boolean;
}

export const ReviewCountBadge: FC<ReviewCountBadgeProps> = ({ count, hideEmpty }) => {
  if (!count && hideEmpty) {
    return null;
  }

  return (
    <Chip>{count ?? 0}</Chip>
  );
};
