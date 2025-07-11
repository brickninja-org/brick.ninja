import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { createMetadata } from '@/lib/metadata';
import { HeroLayout } from '@/components/layout/HeroLayout';

export default function LegalNoticePage() {
  return (
    <HeroLayout hero={<Headline id="legal-notice">Legal Notice</Headline>} toc>
      <p>Last updated May 4, 2025</p>

      <Headline id="contact">Contact</Headline>
      <p>Email: <a href="mailto:support@brick.ninja">support@brick.ninja</a></p>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Legal Notice',
  description: 'Last updated May 4, 2025',
});
