'use client';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { HeroLayout } from '@/components/layout/HeroLayout';

export default function Error({ error }: { error: Error }) {
  return (
    <HeroLayout hero={<Headline id="error">Something went wrong!</Headline>}>
      <pre className="whitespace-pre-wrap break-all">
        {error.stack && (process.env.NODE_ENV === 'production' ? window.btoa(error.stack) : error.stack)}
      </pre>
    </HeroLayout>
  );
}
