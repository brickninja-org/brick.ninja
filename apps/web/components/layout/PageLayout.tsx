import type { FC, ReactNode } from 'react';

import { TableOfContent, TableOfContentContext } from '@brickninja-org/ui/components/table-of-content/TableOfContents';

interface PageLayoutProps {
  children: ReactNode,
  toc?: boolean,
}

export const PageLayout: FC<PageLayoutProps> = ({ children, toc = false }) => {
  return toc
    ? (
        <TableOfContentContext>
          <main className="flex gap-4 px-4">
            <aside className="hidden w-1/4 min-w-64 max-w-96 shrink order-1 md:block">
              <TableOfContent/>
            </aside>
            <div className="flex-1 max-w-full w-3/4 py-4">
              {children}
            </div>
          </main>
        </TableOfContentContext>
      )
    : (
        <main className="flex gap-4 px-4">
          <div className="flex-1 max-w-full w-3/4 py-4">
            {children}
          </div>
        </main>
      );
};
