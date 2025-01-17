import type { FC, ReactNode } from 'react';

import { FlexRow } from '../flex-row/FlexRow';

export interface DialogActionsProps {
  description?: ReactNode;
  children: ReactNode;
}

export const DialogActions: FC<DialogActionsProps> = ({ description, children }) => {
  return (
    <div className="flex items-center gap-4 mt-8 -mx-4 -mb-4 p-4 border-t bg-gray-100">
      {description && <p className="mb-0 mr-auto">{description}</p>}
      <div>
        <FlexRow>{children}</FlexRow>
      </div>
    </div>
  );
};
