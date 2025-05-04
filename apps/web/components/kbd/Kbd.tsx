import type { FC, ReactNode } from 'react';

export interface KbdProps {
  children: ReactNode;
  className?: string;
}

export const Kbd: FC<KbdProps> = ({ children, className }) => {
  return (
    <kbd
      className={`inline-flex items-center justify-center rounded border border-border-dark bg-background-light px-2 py-1.5 text-xs font-semibold text-muted shadow-sm ring-1 ring-slate-900/10 transition duration-75 ease-in-out dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 ${className}`}
    >
      {children}
    </kbd>
  );
};
