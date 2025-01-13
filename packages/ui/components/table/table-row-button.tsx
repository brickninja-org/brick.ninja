import type { FC, ReactNode } from 'react';

export interface TableRowButtonProps {
  onClick: () => void;
  children: ReactNode;
}

export const TableRowButton: FC<TableRowButtonProps> = ({ onClick, children }) => {
  return (
    <tr>
      <td colSpan={999}>
        <button type="button" className="flex items-center justify-center gap-2 w-[calc(100%_+_32px)] -my-2 -mx-4 p-4 cursor-pointer ease-in-out transition-none focus:outline-hidden focus-within:shadow-focus" onClick={onClick}>
          {children}
        </button>
      </td>
    </tr>
  );
};
