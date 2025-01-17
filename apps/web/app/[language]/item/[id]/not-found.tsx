import type { Metadata } from 'next';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { HeroLayout } from '@/components/layout/HeroLayout';

export default function ItemNotFound() {
  return (
    <HeroLayout hero={<Headline id="test">Item not found</Headline>}>
      <p>We couldn&apos;t find the item. The item might not have been added to the API yet.</p>
    </HeroLayout>
  );
}

export const metadata: Metadata = {
  title: 'Item not found',
};
