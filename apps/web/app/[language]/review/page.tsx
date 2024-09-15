import NextLink from 'next/link';

import { ReviewQueue } from '@brickninja-org/database';
import { Headline } from '@brickninja-org/ui/components/headline';
import { Table } from '@brickninja-org/ui/components/table';

import { db } from '@/lib/prisma';
import { HeroLayout } from '@/components/layout/hero-layout';
import { FormatNumber } from '@/components/format/format-number';

const getQueues = async function getQueues() {
  const queues = await db.review.groupBy({
    by: ['queue'],
    where: { state: 'Open' },
    _count: true,
  });

  return queues.reduce<Partial<Record<ReviewQueue, number>>>((grouped, queue) => ({ ...grouped, [queue.queue]: queue._count }), {});
};

export default async function ReviewPage() {
  const queues = await getQueues();

  return (
    <HeroLayout hero={(<Headline id="queues">Review Queues</Headline>)} color="blue">
      <p>Help to improve brick.ninja by reviewing suggested changes.</p>

      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Queue</Table.HeaderCell>
            <Table.HeaderCell>Size</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><NextLink prefetch={false} href="/review/container-content">Container Content</NextLink></td>
            <td><FormatNumber value={queues.ContainerContent ?? 0}/></td>
          </tr>
        </tbody>
      </Table>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Review Queues',
};
