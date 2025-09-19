'use client';

import type { FC } from 'react';
import type { RefProp } from '@brickninja-org/ui/lib/react';
import type { ReloadProps } from './Reload';

import { useState } from 'react';

import { Checkbox } from '@brickninja-org/ui/components/form/Checkbox';

import { Reload } from './Reload';

export const ReloadCheckbox: FC<ReloadProps & RefProp<HTMLLabelElement>> = (({ ref, ...reloadProps }) => {
  const [autoRefresh, setAutorefresh] = useState(false);

  return (
    <>
      {autoRefresh && <Reload {...reloadProps}/>}
      <Checkbox checked={autoRefresh} onChange={setAutorefresh} ref={ref}>
        Auto Refresh
      </Checkbox>
    </>
  );
});
