import type { Metadata } from 'next';

import Link from 'next/link';

import { Headline } from '@brickninja-org/ui/components/headline';

import { HeroLayout } from '@/components/layout/hero-layout';

export default function NotFound() {
  return (
    <HeroLayout hero={<Headline id="404">404 - Page not found</Headline>}>
      <p>We couldn&apos;t find the page you requested. You can try the search to find the content you were looking for.</p>
      <p>If you think this page should exist, you can <Link href="/about">report it or even contribute yourself</Link>.</p>
    </HeroLayout>
  );
}

export const metadata: Metadata = {
  title: '404 · Page not found',
};
