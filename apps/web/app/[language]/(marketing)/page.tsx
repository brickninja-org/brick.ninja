import { Suspense, type FC } from 'react';
import Link from 'next/link';
import { GiNinjaHead } from 'react-icons/gi';

import { Headline } from '@brickninja-org/ui/components/headline';

import { cache } from '@/lib/cache';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { getAlternateUrls } from '@/lib/url';
import { FormatDate } from '@/components/format/format-date';
import { FormatNumber } from '@/components/format/format-number';
import { ItemList, ItemListItem } from '@/components/item/item-list';
import { ItemLink } from '@/components/item/item-link';
import { SkeletonLink } from '@/components/skeleton/skeleton-link';
import { HeroLayout } from '@/components/layout/hero-layout';
import { PageView } from '@/components/page-view/page-view';
import { Translate } from '@/components/i18n/translate';

function MarketingPage({ params: { language }}: PageProps) {
  return (
    <HeroLayout hero={(
      <div className="flex flex-col items-center gap-16 p-4 sm:p-8">
        <div className="flex flex-col z-[1]">
          <div className="flex items-center gap-4 font-bitter text-4xl text-white sm:text-5xl md:text-6xl"><GiNinjaHead/> brick.ninja</div>
          <div className="mx-auto pt-2 border-t-2 border-white font-medium text-base text-white md:text-lg"><Translate language={language} id="subtitle"/></div>
        </div>
      </div>
    )}
    >
      <PageView page="/"/>
      <Suspense fallback={<div className="flex justify-center gap-[32px_64px] min-h-24 flex-wrap -mt-4 mb-8 -mx-4 py-8 px-4 bg-gray-200"/>}>
        <DbStats/>
      </Suspense>

      <Headline id="new-items"><Translate language={language} id="items.new"/></Headline>
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
        return (<ItemListItem key={id}><SkeletonLink/></ItemListItem>);
      })}
    </ItemList>
  );
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
      {items.map((item) => <ItemListItem key={item.id}><ItemLink item={item}/><FormatDate date={item.createdAt} relative/></ItemListItem>)}
    </ItemList>
  );
}

const getDbStats = cache(async () => {
  const [items] = await Promise.all([
    db.item.groupBy({ by: ['type'], _count: true }),
  ]);

  return { items };
}, ['home-db-stats'], { revalidate: 60 });

const Stat: FC<{ href: string, title: string, value: number }> = ({ href, title, value }) => {
  return (
    <Link href={href} className="text-lg text-gray-600 sm:text-2xl"><span className="inline font-medium text-xl sm:text-4xl"><FormatNumber value={value}/></span> {title}</Link>
  );
};

/* eslint-disable-next-line require-await */
async function DbStats() {
  const counts = await getDbStats();

  return (
    <div className="flex flex-wrap justify-center gap-[16px_32px] min-h-[82px] -mt-4 mb-8 -mx-4 py-8 px-4 bg-gray-200 max-sm:flex-col max-sm:items-center sm:min-h-[100px] sm:gap-[32px_64px]">
      {counts.items.map((i) => i.type !== 'Miscellaneouss' ? <Stat key={i.type} href={`/catalog${i.type !== 'Gear' ? `/${i.type.toLowerCase()}s` : '/item'}`} title={`${i.type}${i.type !== 'Gear' ? 's' : ''}`} value={i._count}/> : null)}
    </div>
  );
}

export default MarketingPage;

export function generateMetadata({ params }: PageProps) {
  return {
    title: 'Home',
    alternates: getAlternateUrls('/', params.language),
  };
}
