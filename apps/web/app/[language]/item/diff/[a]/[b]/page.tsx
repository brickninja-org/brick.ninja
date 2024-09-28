import { Fragment } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Separator } from '@brickninja-org/ui/components/layout/separator';
import { Notice } from '@brickninja-org/ui/components/notice';
import type { GetSets } from '@brickset-api/types/data/get-sets';

import { cache } from '@/lib/cache';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/format/format-date';
import { Json } from '@/components/format/json';
import { DiffLayout, DiffLayoutHeader, DiffLayoutRow } from '@/components/layout/DiffLayout';

const getRevisions = cache(async (idA: string, idB: string) => {
  const [a, b] = await Promise.all([
    db?.revision.findUnique({ where: { id: idA }}),
    db?.revision.findUnique({ where: { id: idB }}),
  ]);

  if (!a || !b || a.entity !== b.entity) {
    notFound();
  }

  return { a, b };
}, ['item-revision-compare']);

async function ItemDiffPage({ params }: PageProps<{ a: string, b: string }>) {
  const idA = params.a.toString();
  const idB = params.b.toString();

  const { a, b } = await getRevisions(idA, idB);

  const dataA: GetSets = JSON.parse(a.data);
  const dataB: GetSets = JSON.parse(b.data);
  
  return (
    <DiffLayout>
      <DiffLayoutHeader
        subtitle={[
          <Fragment key="a"><FormatDate date={a.createdAt}/> ▪ <Link href={`/item/${a.id}`}>View revision</Link></Fragment>,
          <Fragment key="b"><FormatDate date={b.createdAt}/> ▪ <Link href={`/item/${b.id}`}>View revision</Link></Fragment>,
        ]}
        title={[dataA.name, dataB.name]}/>

      {dataA.setID != dataB.setID && (
        <div className="p-4 pb-0">
          <Notice>You are comparing two different items</Notice>
        </div>
      )}

      {a.createdAt > b.createdAt && (
        <div className="p-4 pb-0">
          <Notice>You are comparing an old version against a newer version. <Link href={`/item/diff/${b.id}/${a.id}`}>Switch around</Link>.</Notice>
        </div>
      )}

      <DiffLayoutRow left={<Separator/>} right={<Separator/>}/>
      <DiffLayoutRow left={<Json data={dataA} borderless/>} right={<Json data={dataB} borderless/>} changed/>
    </DiffLayout>
  );
}

export default ItemDiffPage;

export const metadata: Metadata = {
  title: 'Compare items',
};
