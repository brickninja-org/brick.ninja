import type { PageProps } from '@/lib/next';
import type { EditContentOrder } from 'app/[language]/item/[id]/_edit-content/types';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReviewState, UserRole } from '@brickninja-org/database';
import { FlexRow } from '@brickninja-org/ui/components/flex-row/FlexRow';
import { Button, LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Separator } from '@brickninja-org/ui/components/layout/Separator';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';
import { Table } from '@brickninja-org/ui/components/table/Table';

import { getUser } from '@/lib/get-user';
import { linkProperties } from '@/lib/link-properties';
import { localizedName } from '@/lib/localized-name';
import { getLoginUrlWithReturnTo } from '@/lib/login-url';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/format/FormatDate';
import { FormatNumber } from '@/components/format/FormatNumber';
import { ItemLink } from '@/components/item/ItemLink';
import { HeroLayout } from '@/components/layout/HeroLayout';

import { approve, reject } from './actions';

const getReview = async function getReview(id: string) {
  const review = await db.review.findUnique({
    where: { id },
    include: {
      relatedItem: {
        select: {
          ...linkProperties,
          contains: { include: { contentItem: { select: linkProperties }}},
        },
      },
      reviewer: { select: { name: true }},
      requester: { select: { name: true }},
    },
  });

  if (!review || !review.relatedItem) {
    notFound();
  }

  return { review, item: review.relatedItem };
};

type ReviewContainerContentPageProps = PageProps<{ id: string }>;

export default async function ReviewContainerContentPage({ params, searchParams }: ReviewContainerContentPageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const { review, item } = await getReview(id);
  const { removedItems, addedItems } = review.changes as unknown as EditContentOrder;

  const user = await getUser();

  const canReview = user && review.state === ReviewState.Open && (review.requesterId !== user.id || user.roles.includes(UserRole.Admin));

  return (
    <HeroLayout hero={<Headline id="queue">Review Container Content</Headline>} color="blue">
      {error !== undefined && (
        <Notice type="error" icon="review-queue">Your changes could not be saved.</Notice>
      )}

      {review.state !== ReviewState.Open && (
        <Notice icon="review-queue">This change was already {review.state === ReviewState.Approved ? 'approved' : 'rejected'} by <strong>{review.reviewer?.name ?? 'Unknown User'}</strong> on <FormatDate date={review.reviewedAt}/></Notice>
      )}
      {review.state === ReviewState.Open && user && review.requesterId === user.id && (
        <Notice type="warning" icon="user">You can not review your own change request.</Notice>
      )}

      <p>Review requested by <strong>{review.requester?.name ?? 'Unknown User'}</strong> on <FormatDate date={review.createdAt}/></p>

      <Headline id="item">Item</Headline>
      <ItemLink item={item}/>

      {(removedItems.length !== 0 || addedItems.length !== 0) && (
        <>
          <Headline id="content">Content</Headline>
          <Table>
            <thead>
              <tr>
                <Table.HeaderCell small>Change</Table.HeaderCell>
                <Table.HeaderCell>Item</Table.HeaderCell>
                <Table.HeaderCell>Item ID</Table.HeaderCell>
                <Table.HeaderCell align="end">Quantity</Table.HeaderCell>
              </tr>
            </thead>
            <tbody>
              {item.contains.map((content) => {
                const isRemoved = removedItems.includes(content.contentItemId);

                return (
                  <tr key={content.contentItemId} data-removed={isRemoved || undefined}>
                    <td>{isRemoved && 'Removed'}</td>
                    <td><ItemLink item={content.contentItem}/></td>
                    <td>{content.contentItemId}</td>
                    <td align="right"><FormatNumber value={content.quantity}/></td>
                  </tr>
                );
              })}
              {addedItems.map((added) => {
                return (
                  <tr key={added._id} data-added>
                    <td>Added</td>
                    <td><ItemLink item={added.item}/></td>
                    <td>{added.item.id}</td>
                    <td align="right"><FormatNumber value={added.quantity}/></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}

      <Headline id="actions">Actions</Headline>
      {!user && (
        <Notice>You need to <Link href={await getLoginUrlWithReturnTo()}>Login</Link> to review this change.</Notice>
      )}

      <form>
        <input type="hidden" name="id" value={id}/>
        <FlexRow>
          <LinkButton external href={`/review/container-content?skip=${review.id}`} icon="chevron-right">Skip</LinkButton>
          <Separator/>
          <Button type="submit" disabled={!canReview} formAction={approve} icon="checkmark">Approve</Button>
          <Button type="submit" disabled={!canReview} formAction={reject} name="reject" value="true" icon="cancel">Reject</Button>
        </FlexRow>
      </form>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata<ReviewContainerContentPageProps>(async ({ params }) => {
  const { language, id } = await params;
  const { item } = await getReview(id);

  return {
    title: `Review Container Content: ${localizedName(item, language)}`,
  };
});
