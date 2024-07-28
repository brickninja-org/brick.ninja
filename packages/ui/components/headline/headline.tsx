"use client";

import type {FC, ReactNode} from "react";
import { useTableOfContentAnchor } from "../table-of-content";

export interface HeadlineProps {
  children: ReactNode;
  id: string;
  noToc?: boolean;
  actions?: ReactNode;
}

export const Headline: FC<HeadlineProps> = ({children, id, noToc, actions}) => {
  const ref = useTableOfContentAnchor(id, {label: children, enabled: !noToc});

  return (
    <h2 className="flex flex-wrap mt-8 mb-4 font-inherit first:mt-0 last:mb-0" ref={ref} id={id}>
      <span className="mr-4 font-bitter text-xl">
        {children}
      </span>
      {actions && <div className="">{actions}</div>}
    </h2>
  );
};
