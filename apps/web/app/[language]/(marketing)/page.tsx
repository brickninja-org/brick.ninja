import type { Language } from '@brickninja-org/database';
import type { Metadata } from 'next';

import { Suspense, type FC } from 'react';
import Link from 'next/link';
import { GiNinjaHead } from 'react-icons/gi';

import { Headline } from '@brickninja-org/ui/components/headline';

import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { getAlternateUrls } from '@/lib/url';
import { FormatDate } from '@/components/format/format-date';
import { FormatNumber } from '@/components/format/format-number';
import { HeroLayout } from '@/components/layout/hero-layout';
import { ItemList } from '@/components/item/item-list';
import { ItemLink } from '@/components/item/item-link';
import { SkeletonLink } from '@/components/item/skeleton-link';

function MarketingPage(/* { params: { language }}: {params: { language: Language }} */) {
  return (
    <HeroLayout hero={(
      <div className="flex flex-col items-center gap-16 p-8">
        <div className="flex flex-col z-[1]">
          <div className="flex items-center gap-4 font-bitter text-6xl text-white"><GiNinjaHead/> brick.ninja</div>
          <div className="mx-auto pt-2 border-t-2 border-white font-medium text-white">The Unofficial LEGO&reg; Database</div>
        </div>
      </div>
    )}
    >
      <Suspense fallback={<div className=""/>}>
        <DbStats/>
      </Suspense>

      <Headline id="new-items">New items</Headline>
      <Suspense fallback={<ListFallback size={24}/>}>
        <NewItems/>
      </Suspense>
    </HeroLayout>
  );
}

function ListFallback({ size }: { size: number }) {
  return (
    <ItemList>
      {[...new Array(size)].map((_, id) => {
        // eslint-disable-next-line react/no-array-index-key
        return (<li key={id}><SkeletonLink/></li>);
      })}
    </ItemList>
  )
}

const getNewItems = cache(
  () => db.item.findMany({ take: 24, orderBy: { createdAt: 'desc' }}),
  ['home-items-new'],
  { revalidate: 60 },
);

async function NewItems() {
  const items = await getNewItems();

  return (
    <ItemList>
      {items.map((item) => <li className="inline-flex w-full items-center justify-between gap-8 mb-2 whitespace-nowrap" key={item.id}><ItemLink item={item}/><FormatDate date={item.createdAt} relative/></li>)}
    </ItemList>
  );
}

const getDbStats = cache(async () => {
  const [items] = await Promise.all([
    db.item.count(),
  ]);

  return { items };
}, ['home-db-stats'], { revalidate: 60 });

const Stat: FC<{ href: string, title: string, value: number }> = ({ href, title, value }) => {
  return (
    <Link href={href} className="text-2xl text-gray-600"><span className="inline font-medium text-4xl"><FormatNumber value={value}/></span> {title}</Link>
  );
};

/* eslint-disable-next-line require-await */
async function DbStats() {
  const counts = await getDbStats();

  return (
    <div className="flex justify-center gap-[32px_64px] min-h-24 flex-wrap -mt-4 mb-8 -mx-4 py-8 px-4 bg-gray-200">
      <Stat href="/sets" title="Sets" value={counts.items}/>
      <Stat href="/minifigs" title="Minifigures" value={3254}/>
      <Stat href="/parts" title="Parts" value={70251}/>
    </div>
  );
}

export default MarketingPage;

export function generateMetadata({ params }: { params: { language: Language }}): Metadata {
  const { language } = params;

  return {
    title: 'Home',
    alternates: getAlternateUrls('/', language),
  };
}
