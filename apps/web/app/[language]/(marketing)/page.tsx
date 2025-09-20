import type { FC, ReactNode } from 'react';

import { Suspense } from 'react';
import Link from 'next/link';
import { GiNinjaHead } from 'react-icons/gi';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { cache } from '@/lib/cache';
import { createMetadata } from '@/lib/metadata';
import { db } from '@/lib/prisma';
import { getLanguage } from '@/lib/translate';
import { FormatDate } from '@/components/format/FormatDate';
import { FormatNumber } from '@/components/format/FormatNumber';
import { ItemList } from '@/components/item-list';
import { ItemLink } from '@/components/item/ItemLink';
import { SkeletonLink } from '@/components/skeleton';
import { HeroLayout } from '@/components/layout/HeroLayout';
import { PageView } from '@/components/page-view/PageView';
import { Translate } from '@/components/i18n/Translate';
import { ProductLink } from '@/components/product/ProductLink';

async function MarketingPage() {
  const language = await getLanguage();

  return (
    <HeroLayout hero={(
      <div className="flex flex-col items-center gap-16 p-4 sm:p-8">
        <div className="flex flex-col z-1">
          <div className="flex items-center gap-4 font-bitter text-4xl text-white sm:text-5xl md:text-6xl"><GiNinjaHead/> brick-catalog.eu</div>
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

      <Headline id="new-products"><Translate id="products.new"/></Headline>
      <Suspense fallback={<ListFallback size={24}/>}>
        <NewProducts/>
      </Suspense>
    </HeroLayout>
  );
}

function ListFallback({ size }: { size: number }) {
  return (
    <ItemList>
      {[...new Array(size)].map((_, id) => {
        // eslint-disable-next-line react/no-array-index-key
        return (<ItemList.Item key={id}><SkeletonLink/></ItemList.Item>);
      })}
    </ItemList>
  );
}

const getNewItems = cache(
  () => db.item.findMany({ take: 24, include: { icon: true }, orderBy: { createdAt: 'desc' }}),
  ['home-items-new'],
  { revalidate: 60 },
);

async function NewItems() {
  const items = await getNewItems();

  return (
    <ItemList>
      {items.map((item) => <ItemList.Item key={item.id}><ItemLink item={item}/><FormatDate date={item.createdAt} relative/></ItemList.Item>)}
    </ItemList>
  );
}

const getNewProducts = cache(
  () => db.product.findMany({ take: 24, include: { icon: true }, orderBy: { createdAt: 'desc' }}),
  ['home-products-new'],
  { revalidate: 60 },
);

async function NewProducts() {
  const products = await getNewProducts();

  return (
    <ItemList>
      {products.map((product) => <ItemList.Item key={product.id}><ProductLink product={product}/><FormatDate date={product.createdAt} relative/></ItemList.Item>)}
    </ItemList>
  );
}

const getDbStats = cache(async () => {
  const [items, products] = await Promise.all([
    // db.item.groupBy({ where: { type: { not: 'Miscellaneous' }}, by: ['type'], _count: true }),
    db.item.count(),
    db.product.count(),
  ]);

  return { items, products };
}, ['home-db-stats'], { revalidate: 60 });

const Stat: FC<{ href: string, title: ReactNode, value: number }> = ({ href, title, value }) => {
  return (
    <Link href={href} className="text-lg text-gray-600 sm:text-2xl"><span className="inline font-medium text-xl sm:text-4xl"><FormatNumber value={value}/></span> {title}</Link>
  );
};

async function DbStats() {
  const counts = await getDbStats();

  return (
    <div className="flex flex-wrap justify-center gap-[16px_32px] min-h-[82px] -mt-4 mb-8 -mx-4 py-8 px-4 bg-gray-200 max-sm:flex-col max-sm:items-center sm:min-h-[100px] sm:gap-[32px_64px]">
      {/* counts.items.map((i) => <Stat key={i.type} href={`/catalog${i.type !== 'Gear' ? `/${i.type.toLowerCase()}s` : '/item'}`} title={`${i.type}${i.type !== 'Gear' ? 's' : ''}`} value={i._count}/>) */}
      <Stat href="/item" title={<Translate id="navigation.items"/>} value={counts.items}/>
      <Stat href="/sets" title={<Translate id="navigation.products"/>} value={counts.products}/>
    </div>
  );
}

export default MarketingPage;

export const generateMetadata = createMetadata({
  title: 'Home',
});
