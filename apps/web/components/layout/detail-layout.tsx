import type { FC, ReactNode } from 'react';

import './detail-layout.css';

import { tv } from 'tailwind-variants';

import { TableOfContent, TableOfContentContext } from '@brickninja-org/ui/components/table-of-content';

interface DetailLayoutProps {
  title: ReactNode;
  breadcrumb?: ReactNode;
  children: ReactNode;
  infobox?: ReactNode;
  className?: string;
  actions?: ReactNode;
}

const headline = tv({
  base: 'headline [grid-area:_headline] grid p-4 border-b bg-gray-50',
});

const DetailLayout: FC<DetailLayoutProps> = ({ title, children, breadcrumb, infobox }) => {
  return (
    <TableOfContentContext>
      <main className="main [grid-area:_main] grid before:[grid-area:_padding] before:bg-gray-50 before:border-b before:[content:_''] max-[920px]:before:hidden">
        <div className={headline()}>
          <h1 className="[grid-area:_title] font-bold text-2xl">{title}</h1>
          {breadcrumb && <div className="[grid-area:_breadcrumb] mt-2 text-sm text-gray-800">{breadcrumb}</div>}
        </div>
        <aside className="[grid-area:_toc] max-[920px]:hidden">
          <TableOfContent/>
        </aside>
        {infobox && (
          <aside className="[grid-area:_infobox] p-4 border border-t-0 max-[920px]:border-x-0">
            {infobox}
          </aside>
        )}
        <div className="[grid-area:_content] p-4">
          {children}
        </div>
      </main>
    </TableOfContentContext>
  );
};

export default DetailLayout;