import type { FC, ReactNode } from 'react';

export interface LabelProps {
  label: ReactNode;
  children: ReactNode;
}

export const Label: FC<LabelProps> = ({ label, children }) => {
  return (
    <label className="flex-1 flex flex-col gap-2">
      <div>{label}</div>
      <div className="flex gap-2">{children}</div>
    </label>
  );
};
