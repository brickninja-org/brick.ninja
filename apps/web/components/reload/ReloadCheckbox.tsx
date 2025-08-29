'use client';

import type { FC } from 'react';
import type { RefProp } from '@brickninja-org/ui/lib/react';
import type { ReloadProps } from './Reload';

import { useState } from 'react';
import { Checkbox } from '@heroui/react';

import { Reload } from './Reload';

export const ReloadCheckbox: FC<ReloadProps & RefProp<HTMLInputElement>> = (({ ref, ...reloadProps }) => {
  const [autoRefresh, setAutorefresh] = useState(false);

  return (
    <>
      {autoRefresh && <Reload {...reloadProps}/>}
      <Checkbox isSelected={autoRefresh} radius="sm" color="primary" onValueChange={setAutorefresh} ref={ref}>
        Auto Refresh
      </Checkbox>
    </>
  );
});
