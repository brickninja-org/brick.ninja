'use client';

import type { FC, ReactNode } from 'react';
import { useTableOfContentAnchor } from '../table-of-content';

export interface HeadlineProps {
  children: ReactNode;
  id: string;
  noToc?: boolean;
  actions?: ReactNode;
}

export const Headline: FC<HeadlineProps> = ({ children, id, noToc, actions }) => {
  const ref = useTableOfContentAnchor(id, { label: children, enabled: !noToc });

  return (
    <h2 className="flex flex-wrap mt-8 mb-4 [font:_inherit] first:mt-0 last:mb-0" ref={ref} id={id}>
      <span className="flex-1 mr-4 font-bitter leading-9 text-xl">
        {children}
      </span>
      {actions && <div className="flex flex-wrap gap-2 items-center">{actions}</div>}
    </h2>
  );
};
