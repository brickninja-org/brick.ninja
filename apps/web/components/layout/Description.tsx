import type { FC, ReactNode } from 'react';

interface DescriptionProps {
  children: ReactNode,
  actions?: ReactNode,
}

export const Description: FC<DescriptionProps> = ({ children, actions }) => {
  return (
    <div className="flex items-baseline gap-4 flex-wrap mb-6">
      <p className="flex-1 min-w-[66%] mb-0">{children}</p>
      {actions && <div className="flex items-center flex-wrap gap-2">{actions}</div>}
    </div>
  );
};
