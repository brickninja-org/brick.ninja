'use client';

import type { FC } from 'react';
import type { RefProp } from '@brickninja-org/ui/lib/react';
import type { ReloadProps } from './Reload';

import { useState } from 'react';
import { Checkbox, cn } from '@heroui/react';

import { Reload } from './Reload';

export const ReloadCheckbox: FC<ReloadProps & RefProp<HTMLInputElement>> = (({ ref, ...reloadProps }) => {
  const [autoRefresh, setAutorefresh] = useState(false);

  return (
    <>
      {autoRefresh && <Reload {...reloadProps}/>}
      <Checkbox
        ref={ref}
        aria-label="Auto Refresh"
        isSelected={autoRefresh}
        classNames={{
          base: cn(
            'inline-flex items-center justify-start',
            'rounded-sm bg-content1 hover:bg-content2'
          ),
        }}
        color="primary"
        radius="sm"
        onValueChange={setAutorefresh}
      >
        Auto Refresh
      </Checkbox>
    </>
  );
});
