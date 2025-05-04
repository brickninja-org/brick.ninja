import type { FC } from 'react';
import type { Metadata } from 'next';
import type { Language } from '@brickninja-org/database';
import type { PageProps } from '@/lib/next';

type BuildPageProps = PageProps<{ id: string }>;

import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/link-properties';
import { pageView } from '@/lib/page-view';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/format/FormatDate';
import { ItemLink } from '@/components/item/ItemLink';
import { ItemList, ItemListItem } from '@/components/item/ItemList';
import DetailLayout from '@/components/layout/DetailLayout';
import { ProductLink } from '@/components/product/ProductLink';
import { SkeletonLink } from '@/components/skeleton/SkeletonLink';

function timed<Args extends unknown[], Out>(callback: (...args: Args) => Promise<Out>): (...args: Args) => Promise<Out> {
  const timedFunction = async (...args: Args): Promise<Out> => {
    const start = new Date();
    const result = await callback(...args);
    const end = new Date();

    console.log(`timed - ${callback.name} - took ${end.valueOf() - start.valueOf()}ms`);

    return result;
  };

  return timedFunction;
}

const getBuild = cache(timed(async function getBuild(buildId: number) {
  const build = await db.build.findUnique({
    where: { id: buildId },
  });

  if(!build) {
    notFound();
  }

  return build;
}), ['build'], { revalidate: 600 });

const getUpdatedItems = cache(timed(function getUpdatedItems(buildId: number, language: Language) {
  // return db.item.findMany({
  //   where: { history: { some: { revision: { buildId, type: 'Update', language, entity: 'Item' }}}},
  //   include: { icon: true },
  //   take: 500,
  // });

  return db.revision.findMany({
    where: { buildId, type: 'Updated', language, entity: 'Item' },
    include: { itemHistory: { include: { item: { select: linkProperties }}}},
    take: 500,
  });
}), ['build-updated-items'], { revalidate: 600 });

const getUpdatedProducts = cache(timed(function getUpdatedProducts(buildId: number, language: Language) {
  return db.product.findMany({
    where: { history: { some: { revision: { buildId, type: 'Updated', language }}}},
    include: {
      icon: true,
      history: {
        select: { revisionId: true },
        where: { revision: { buildId: { lte: buildId }, language }},
        take: 2,
        orderBy: { revision: { buildId: 'desc' }}
      }
    },
    take: 500,
  });
}), ['build-updated-products'], { revalidate: 600 });

async function BuildDetail({ params }: BuildPageProps) {
  const { language, id } = await params;
  const buildId: number = Number(id);

  const itemsPromise = getUpdatedItems(buildId, language);
  const productsPromise = getUpdatedProducts(buildId, language);

  const build = await getBuild(buildId);
  await pageView('build', buildId);

  return (
    <DetailLayout title={`Build ${build.id}`} breadcrumb="Build">
      Released on <FormatDate date={build.createdAt}/>

      <Suspense fallback={<Fallback headline="Updated items" id="items"/>}>
        <UpdatedItems itemsPromise={itemsPromise}/>
      </Suspense>

      <Suspense fallback={<Fallback headline="Updated products" id="products"/>}>
        <UpdatedProducts productsPromise={productsPromise}/>
      </Suspense>
    </DetailLayout>
  );
}

const Fallback: FC<{ headline: string, id: string }> = ({ headline, id }) => {
  return (
    <>
      <Headline id={id}>{headline}</Headline>
      <ItemList>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
      </ItemList>
    </>
  );
};

const UpdatedItems: FC<{ itemsPromise: ReturnType<typeof getUpdatedItems> }> = async function({ itemsPromise }) {
  const itemRevisions = await itemsPromise;

  return (
    <>
      <Headline id="items">Updated items ({itemRevisions.length})</Headline>
      <ItemList>
        {itemRevisions.map((revision) => (
          <ItemListItem key={revision.id}><ItemLink item={revision.itemHistory!.item} revision={revision.id}/></ItemListItem>
        ))}
      </ItemList>
    </>
  );
};

const UpdatedProducts: FC<{ productsPromise: ReturnType<typeof getUpdatedProducts> }> = async function({ productsPromise }) {
  const products = await productsPromise;

  return (
    <>
      <Headline id="products">Updated products ({products.length})</Headline>
      <ItemList>
        {products.map((product) => (
          <ItemListItem key={product.id}>
            <ProductLink product={product}/>
            <Link href={`/product/diff/${product.history[1].revisionId}/${product.history[0].revisionId}`}>Compare</Link>
          </ItemListItem>
        ))}
      </ItemList>
    </>
  );
};

export default BuildDetail;

export async function generateMetadata({ params }: BuildPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Build ${id}`,
  };
}
