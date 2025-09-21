'use client';

import type { FC, ReactNode } from 'react';
import type { FlexRowVariants } from './flex-row.styles';
import type { RefProp } from '../../lib/react';

import { Slot as SlotPrimitive } from '@radix-ui/react-slot';
import { flexRowVariants } from './flex-row.styles';

interface FlexRowProps extends FlexRowVariants, RefProp<HTMLElement> {
  asChild?: boolean,
  className?: string,
  children: ReactNode,
}

const FlexRow: FC<FlexRowProps> = ({
  ref, asChild, children, className, align, inline, wrap,
}) => {
  const styles = flexRowVariants({ align, inline, wrap, className });

  if (asChild) {
    return (
      <SlotPrimitive ref={ref} className={styles}>
        {children}
      </SlotPrimitive>
    );
  }

  return (
    <div className={styles}>
      {children}
    </div>
  );
};

FlexRow.displayName = 'BrickCatalogUI.FlexRow';

export default FlexRow;
export type { FlexRowProps };
