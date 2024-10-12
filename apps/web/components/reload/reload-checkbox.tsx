'use client';

import { useState, type FC } from 'react';

import { Checkbox } from '@brickninja-org/ui/components/form/checkbox';

import { Reload, type ReloadProps } from './reload';
import type { RefProp } from '@brickninja-org/ui/lib/react';

export const ReloadCheckbox: FC<ReloadProps & RefProp<HTMLLabelElement>> = (({ ref, ...reloadProps }) => {
  const [autoRefresh, setAutorefresh] = useState(false);

  return (
    <>
      {autoRefresh && <Reload {...reloadProps}/>}
      <Checkbox checked={autoRefresh} onChange={setAutorefresh} ref={ref}>
        Auto refresh
      </Checkbox>
    </>
  );
});
