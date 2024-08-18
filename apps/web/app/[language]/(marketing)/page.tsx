import type { Language } from '@brickninja-org/database';
import type { Metadata } from 'next';

import { Suspense, type FC } from 'react';
import Link from 'next/link';
import { GiNinjaHead } from 'react-icons/gi';

import { Headline } from '@brickninja-org/ui/components/headline';

import { getAlternateUrls } from '@/lib/url';
import { FormatNumber } from '@/components/format/format-number';
import { HeroLayout } from '@/components/layout/hero-layout';

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
    </HeroLayout>
  );
}

const Stat: FC<{ href: string, title: string, value: number }> = ({ href, title, value }) => {
  return (
    <Link href={href} className="text-2xl text-gray-600"><span className="inline font-medium text-4xl"><FormatNumber value={value}/></span> {title}</Link>
  );
};

/* eslint-disable-next-line require-await */
async function DbStats() {
  return (
    <div className="flex justify-center gap-[32px_64px] min-h-24 flex-wrap -mt-4 mb-8 -mx-4 py-8 px-4 bg-gray-200">
      <Stat href="/sets" title="Sets" value={12754}/>
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
