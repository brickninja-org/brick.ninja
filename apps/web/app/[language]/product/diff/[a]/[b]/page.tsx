import type { Product } from '@brickninjaapi/types/data/product';
import type { PageProps } from '@/lib/next';

import { Fragment } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Separator } from '@brickninja-org/ui/components/layout/Separator';
import { Notice } from '@brickninja-org/ui/components/notice/Notice';

import { cache } from '@/lib/cache';
import { createMetadata } from '@/lib/metadata';
import { parseIcon } from '@/lib/parse-icon';
import { db } from '@/lib/prisma';
import { EntityIcon } from '@/components/entity/EntityIcon';
import { FormatDate } from '@/components/format/FormatDate';
import { Json } from '@/components/format/Json';
import { DiffLayout, DiffLayoutHeader, DiffLayoutRow } from '@/components/layout/DiffLayout';

const getRevisions = cache(async (idA: string, idB: string) => {
  const [a, b] = await Promise.all([
    db.revision.findUnique({ where: { id: idA }}),
    db.revision.findUnique({ where: { id: idB }}),
  ]);

  if (!a || !b || a.entity !== 'Product' || b.entity !== 'Product') {
    notFound();
  }

  return { a, b };
}, ['product-revisions-compare']);

async function ProductDiffPage({ params }: PageProps<{ a: string, b: string }>) {
  const { a: paramA, b: paramB } = await params;

  const idA = paramA.toString();
  const idB = paramB.toString();

  const { a, b } = await getRevisions(idA, idB);

  const dataA: Product = JSON.parse(a.data);
  const dataB: Product = JSON.parse(b.data);

  const iconA = parseIcon(dataA.icon);
  const iconB = parseIcon(dataB.icon);

  return (
    <DiffLayout>
      <DiffLayoutHeader
        icons={[
          iconA && <EntityIcon key="imageA" type="product" icon={iconA} size={48}/>,
          iconB && <EntityIcon key="imageB" type="product" icon={iconB} size={48}/>,
        ]}
        title={[
          dataA.name,
          dataB.name,
        ]}
        subtitle={[
          <Fragment key="a"><FormatDate date={a.createdAt}/> (<Link href={`/build/${a.buildId}`}>Build {a.buildId}</Link>) ▪ <Link href={`/product/${dataA.id}/${a.id}`}>View revision</Link></Fragment>,
          <Fragment key="b"><FormatDate date={b.createdAt}/> (<Link href={`/build/${b.buildId}`}>Build {b.buildId}</Link>) ▪ <Link href={`/product/${dataB.id}/${b.id}`}>View revision</Link></Fragment>,
        ]}/>

      {dataA.id !== dataB.id && (
        <div className="pt-4 px-4">
          <Notice>You are comparing two different products.</Notice>
        </div>
      )}

      {a.createdAt > b.createdAt && (
        <div className="pt-4 px-4">
          <Notice>You are comparing an old version against a newer version. <Link href={`/product/diff/${b.id}/${a.id}`}>Switch around</Link>.</Notice>
        </div>
      )}
      <DiffLayoutRow left={<Separator/>} right={<Separator/>}/>
      <DiffLayoutRow left={<Json data={dataA} borderless/>} right={<Json data={dataB} borderless/>} changed/>
    </DiffLayout>
  );
}

export default ProductDiffPage;

export const generateMetadata = createMetadata({
  title: 'Compare Products',
  robots: { index: false },
});
