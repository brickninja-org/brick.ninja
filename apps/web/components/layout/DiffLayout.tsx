import type { FC, ReactNode } from 'react';

import { cn } from '@brickninja-org/ui/lib';
import { tv } from 'tailwind-variants';

export interface DiffLayoutProps {
  children: ReactNode;
}

export const DiffLayout: FC<DiffLayoutProps> = ({ children }) => {
  return (
    <div className="">
      {children}
    </div>
  );
};

interface DiffLayoutHeaderProps {
  icons: [ a: ReactNode | undefined, b: ReactNode | undefined ],
  title: [ a: ReactNode, b: ReactNode ],
  subtitle: [ a: ReactNode, b: ReactNode ],
}

const diff = tv({
  slots: {
    base: 'flex flex-col md:flex-row bg-gray-100', // diffHeader
    row: 'flex flex-col md:flex-row last:flex-1', // diffRow, variant
    header: '[grid-area:_headline] border-b border-gray-200', // header
    title: '[grid-area:_title] font-bitter font-bold text-lg lg:text-2xl', // title
    breadcrumb: '[grid-area:_breadcrumb] text-sm text-muted', // breadcrumb
    column: '', // right | left
   },
  variants: {
    variant: {
      added: {
        column: '',
      },
      removed: {
        column: '',
      },
      changed: {
        column: '',
      },
    },
    right: {
      true: '',
    },
  },
  compoundSlots: [
    {
      slots: ['column', 'header'],
      class: ['flex-1 md:w-1/2  py-2 px-4'],
    },
    {
      slots: ['column', 'header'],
      right: true,
      class: 'md:border-l border-gray-200',
    },
    {
      slots: [],
      right: true,
      class: '',
    },
  ],
  compoundVariants: [
    {
      variant: 'added',
      right: false,
      class: {
        column: 'bg-[F4433622]',
      },
    },
    {
      variant: 'added',
      right: true,
      class: {
        column: 'bg-[#8bc34a33]',
      },
    },
    {
      variant: 'removed',
      right: false,
      class: {
        column: 'bg-[#F4433633]',
      },
    },
    {
      variant: 'removed',
      right: true,
      class: {
        column: 'bg-[#8bc34a22]',
      },
    },
    {
      variant: 'changed',
      right: false,
      class: {
        column: 'bg-[#F4433633]',
      },
    },
    {
      variant: 'changed',
      right: true,
      class: {
        column: 'bg-[#8bc34a33]',
      },
    },
  ],
  defaultVariants: {},
});

export const DiffLayoutHeader: FC<DiffLayoutHeaderProps> = ({ title, subtitle, icons }) => {
  const { base, title: name, header, breadcrumb } = diff();
  return (
    <div className={base()}>
      <div className={cn(header(), 'py-4')}>
        {icons[0]}
        <div className={name()}>{title[0]}</div>
        <div className={breadcrumb()}>{subtitle[0]}</div>
      </div>
      <div className={cn(header({ right: true }))}>
        {icons[1]}
        <div className={name()}>{title[1]}</div>
        <div className={breadcrumb()}>{subtitle[1]}</div>
      </div>
    </div>
  );
};


interface DiffLayoutRowProps {
  left: ReactNode;
  right: ReactNode;
  changed?: boolean;
}

export const DiffLayoutRow: FC<DiffLayoutRowProps> = ({ left, right, changed = false }) => {
  const { column, row } = diff();
  const variant = !left ? 'added' : !right ? 'removed' : left && right && changed ? 'changed' : undefined;

  return (
    <div className={row({ variant })}>
      <div className={column({ variant, right: !left })}>{left}</div>
      <div className={column({ variant, right: !!right })}>{right}</div>
    </div>
  );
};
