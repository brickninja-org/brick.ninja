'use client';

import type { FC } from 'react';

import { Button, type ButtonProps } from '@brickninja-org/ui/components/form/button';

export interface EditContentsProps {
  apperance: ButtonProps['appearance'];
  // itemId: number;
}

export const EditContents: FC<EditContentsProps> = ({ apperance }) => {
  return (
    <>
      <Button appearance={apperance}>Edit Content</Button>
    </>
  );
};
