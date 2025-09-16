import type { FC } from 'react';
import type { Language, ReviewQueue } from '@brickninja-org/database';

import { Suspense, use } from 'react';
import { Card, CardBody, CardHeader, Chip, Divider, Link, Popover, PopoverContent, PopoverTrigger, type ChipProps } from '@heroui/react';

import { groupByUnique } from '@brickninja-org/helper/group-by';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { Button } from '@/components/button';
import { Iconify } from '@/components/iconify/iconify.client';
import { Translate } from '@/components/i18n/Translate';

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
  language: Language,
}

export const ReviewButton: FC<ReviewButtonProps> = ({ language }) => {
  return (
    <Suspense fallback={<InternalReviewButton language={language} data={undefined}/>}>
      <InternalReviewButton language={language} data={getOpenReviews()}/>
    </Suspense>
  );
};

interface InternalReviewButtonProps extends ReviewButtonProps {
  data: ReturnType<typeof getOpenReviews> | undefined,
}

const InternalReviewButton: FC<InternalReviewButtonProps> = ({ language, data }) => {
  const reviewCounts = data ? use(data) : undefined;

  const button = (
    <Button
      asChild
      aria-label="Review"
      className="min-w-10 w-10 md:min-w-20 md:w-fit rounded-sm font-normal"
      variant="ghost"
    >
      <Link href="/review">
        <Iconify icon="lucide:edit"/>
        <span className="hidden md:block">
          <Translate language={language} id="review"/>
        </span>
        <ReviewCountChip hideEmpty count={reviewCounts?._total} classNames={{ base: 'hidden md:inline-flex' }}/>
      </Link>
    </Button>
  );

  return (
    <Popover offset={8} placement="bottom-end" radius="sm" shadow="md">
      <PopoverTrigger>{button}</PopoverTrigger>
      <PopoverContent className="max-w-[90vw] sm:max-w-[380px] p-0">
        <Card className="w-full max-w-[420px]" radius="sm" shadow="none">
          <CardHeader className="bg-content2 dark:bg-content1">
            <Translate language={language} id="review.description"/>
          </CardHeader>
          <Divider/>
          <CardBody>
            <Button
              asChild
              className="flex items-center justify-between gap-4 rounded-sm font-normal"
              variant="ghost"
            >
              <Link href="/review/container-content">
                <Translate language={language} id="review.queue.ContainerContent"/>
                <ReviewCountChip count={reviewCounts?.ContainerContent}/>
              </Link>
            </Button>
          </CardBody>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export interface ReviewCountChipProps extends ChipProps {
  count: number | undefined,
  hideEmpty?: boolean,
}

export const ReviewCountChip: FC<ReviewCountChipProps> = ({ count, hideEmpty, ...props }) => {
  if (!count && hideEmpty) {
    return null;
  }

  return (
    <Chip size="sm" {...props}>{count ?? 0}</Chip>
  );
};
