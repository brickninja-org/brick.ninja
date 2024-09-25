'use client';

import { type FC, forwardRef, useCallback, useEffect, useState } from 'react';
import { IoCopyOutline } from 'react-icons/io5';

import { Button, type ButtonProps } from '../button';

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  copy: string;
}

export const CopyButton: FC<CopyButtonProps> = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton ({ copy, ...props }, ref) {
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

  const overrideProps: Partial<ButtonProps> = copied && props.icon ? { icon: <IoCopyOutline size={20}/> } : {};

  return (
    <Button onClick={handleCopy} {...props} {...overrideProps} ref={ref}/>
  );
});
