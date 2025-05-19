import type { FC } from 'react';
import type { Language, ReviewQueue } from '@brickninja-org/database';

import { Suspense, use } from 'react';
import { Button } from '@heroui/react';

import { groupByUnique } from '@brickninja-org/helper/group-by';
import { Icon } from '@brickninja-org/ui/icons';
import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { Translate } from '@/components/i18n/Translate';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';

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
    <Dropdown hideTop={false} preferredPlacement="bottom" button={button}>
      <MenuList>
        <div className="max-w-[320px] -mt-2 -mx-2 mb-3 py-4 px-6 bg-background-light border-b border-(--color-border-dark) leading-normal">
          <Translate language={language} id="review.description"/>
        </div>
        <Button radius="sm" variant="light" className="flex-1 flex items-center justify-between gap-4" href="/review/container-content"><Translate language={language} id="review.queue.ContainerContent"/> <ReviewCountBadge count={reviewCounts?.ContainerContent}/></Button>
      </MenuList>
    </Dropdown>
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
    <span className="ml-2 px-2 rounded-full bg-background-light border border-(--color-border-dark) text-sm [font-feature-settings:'tnum'_1]">{count ?? 0}</span>
  );
};
