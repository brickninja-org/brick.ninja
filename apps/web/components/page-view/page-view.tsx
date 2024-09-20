import 'server-only';

import { Suspense, type FC } from 'react';

import { pageView } from '@/lib/page-view';

interface PageViewProps {
  page: string;
}

// run this in a suspence, so this does not block rendering
export const PageView: FC<PageViewProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <PageViewInternal {...props}/>
    </Suspense>
  );
};

const PageViewInternal: FC<PageViewProps> = async ({ page }) => {
  await pageView(page);

  return null;
};
