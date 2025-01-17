import type { FC } from 'react';


export interface UnknownItemProps {
  id: number;
}

export const UnknownItem: FC<UnknownItemProps> = ({ id }) => {
  return (
    <span data-id={id} className="inline-flex items-center gap-2 [justify-self:flex-start] overflow-hidden">
      <span className="py-[2px] overflow-hidden text-ellipsis">Unknown item</span>
    </span>
  );
};
