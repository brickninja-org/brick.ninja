import type { FC } from 'react';
import type { Language, ReviewQueue } from '@brickninja-org/database';

import { Suspense, use } from 'react';

import { groupByUnique } from '@brickninja-org/helper/group-by';
import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { LinkButton } from '@/components/button';
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
    <LinkButton
      aria-label="Review"
      className="group min-w-10 w-10 md:min-w-20 md:w-fit rounded-sm font-normal"
      href="/review"
      icon="pencil-to-square"
      variant="ghost"
    >
      <span className="hidden md:block">
        <Translate language={language} id="review"/>
      </span>
      <ReviewCountChip hideEmpty count={reviewCounts?._total}/>
    </LinkButton>
  );

  return (
    <Dropdown
      arrowColor="var(--accent-soft)"
      hideTop={false}
      preferredPlacement="bottom"
      button={button}
    >
      <MenuList>
        <div className="max-w-[320px] -mt-2 -mx-2 mb-3 py-4 px-6 border-b border-border bg-accent-soft text-accent-soft-background leading-normal">
          <Translate language={language} id="review.description"/>
        </div>
        <LinkButton
          variant="ghost"
          className="flex items-center justify-between gap-4 rounded-sm font-normal"
          href="/review/container-content"
        >
          <Translate language={language} id="review.queue.ContainerContent"/>
          <ReviewCountChip count={reviewCounts?.ContainerContent}/>
        </LinkButton>
      </MenuList>
    </Dropdown>
  );
};

export interface ReviewCountChipProps {
  count: number | undefined,
  hideEmpty?: boolean,
}

export const ReviewCountChip: FC<ReviewCountChipProps> = ({ count, hideEmpty }) => {
  if (!count && hideEmpty) {
    return null;
  }

  return (
    <span className="hidden md:block px-2 rounded-full bg-surface-2 border border-border text-sm [font-feature-settings:'tnum'_1]">{count ?? 0}</span>
  );
};
