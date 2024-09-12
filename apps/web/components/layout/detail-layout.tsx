import type { FC, ReactNode } from 'react';

import './main.css';

import { tv } from 'tailwind-variants';

import { TableOfContent, TableOfContentContext } from '@brickninja-org/ui/components/table-of-content';

interface DetailLayoutProps {
  title: ReactNode;
  breadcrumbs?: ReactNode;
  children: ReactNode;
  infobox?: ReactNode;
  className?: string;
  actions?: ReactNode;
}

const headline = tv({
  base: 'headline [grid-area:_headline] grid p-4 border-b bg-gray-50',
});

const DetailLayout: FC<DetailLayoutProps> = ({ title, children, infobox }) => {
  return (
    <TableOfContentContext>
      <main className="main [grid-area:_main] grid before:[grid-area:_padding] before:bg-gray-50 before:border-b before:[content:_'']">
        <div className={headline()}>
          <h1 className="[grid-area:_title] font-bold text-2xl">{title}</h1>
        </div>
        <aside className="[grid-area:_toc]">
          <TableOfContent/>
        </aside>
        {infobox && (
          <aside className="[grid-area:_infobox] grid p-4 border border-t-0">
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