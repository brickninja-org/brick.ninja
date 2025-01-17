import type { Metadata } from 'next';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { TableOfContentAnchor } from '@brickninja-org/ui/components/table-of-content/TableOfContents';

import { HeroLayout } from '@/components/layout/HeroLayout';

export default function AboutPage() {
  return (
    <HeroLayout hero={<Headline id="about-page">About</Headline>} toc>
      <TableOfContentAnchor id="about">About</TableOfContentAnchor>
      <p><strong>brick.ninja</strong> is a database website for LEGO&reg; sets, minifigures and parts. Development started in July 2024. It is completly written using modern technology.</p>

      <Headline id="technology">Technology</Headline>
    </HeroLayout>
  );
}

export const metadata: Metadata = {
  title: 'About',
};
