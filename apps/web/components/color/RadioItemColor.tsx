'use client';

import type { FC } from 'react';
import type { RadioProps } from '@heroui/react';

import { cn, Tooltip, useRadio, VisuallyHidden } from '@heroui/react';

export type RadioItemColorProps = Omit<RadioProps, 'color'> & { color?: string; tooltip?: string };

export const RadioItemColor: FC<RadioItemColorProps> = ({ color, tooltip, ref, ...props }) => {
 const { Component, isSelected, isFocusVisible, getBaseProps, getInputProps } = useRadio(props);

  return (
    <Tooltip content={tooltip} delay={1000} isDisabled={!tooltip} offset={0} placement="top">
      <Component {...getBaseProps()} ref={ref}>
        <VisuallyHidden>
          <input {...getInputProps()}/>
        </VisuallyHidden>
        <span
          className={cn(
            'border-opacity-10 pointer-events-none h-8 w-8 rounded-full border border-black transition-transform group-data-[pressed=true]:scale-90',
            { 'ring-offset-content1 ring-2 ring-offset-2': isSelected },
          )}
          style={{
            backgroundColor: color,
            '--tw-ring-color': isSelected || isFocusVisible ? 'hsl(var(--heroui-primary))' : 'transparent',
          }}/>
      </Component>
    </Tooltip>
  );
};
