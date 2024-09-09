'use client';

import { forwardRef, useState } from 'react';

import { Checkbox } from '@brickninja-org/ui/components/form/checkbox';

import { Reload, type ReloadProps } from './reload';

export const ReloadCheckbox = forwardRef<HTMLLabelElement, ReloadProps>(({ ...reloadProps }, ref) => {
  const [autoRefresh, setAutorefresh] = useState(false);

  return (
    <>
      {autoRefresh && <Reload {...reloadProps}/>}
      <Checkbox checked={autoRefresh} onChange={setAutorefresh} ref={ref!}>
        Auto refresh
      </Checkbox>
    </>
  );
});

ReloadCheckbox.displayName = 'ReloadCheckbox';
