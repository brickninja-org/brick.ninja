'use client';

import type { FC } from 'react';
import type { ButtonProps } from '@/components/button';

import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/button';

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'onPress'> {
  copy: string,
}

export const CopyButton: FC<CopyButtonProps> = ({ ref, copy, ...props }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout = 0;

    if(copied) {
      timeout = window.setTimeout(() => setCopied(false), 500);
    }

    return () => {
      if(timeout) {
        clearTimeout(timeout);
      }
    };
  }, [copied]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(copy).then(() => setCopied(true));
  }, [copy]);

  const overrideProps: Partial<ButtonProps> = copied && props.icon ? { icon: 'copy-check' } : {};

  return (
    <Button onPress={handleCopy} {...props} {...overrideProps} ref={ref}/>
  );
};
