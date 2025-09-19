'use client';

import type { FC, ReactNode } from 'react';
import type { ButtonProps } from '@/components/button';

import { useFormStatus } from 'react-dom';

import { Button } from '@/components/button';

export interface SubmitButtonProps extends Omit<ButtonProps, 'asChild' | 'children' | 'className' | 'isPending' | 'type'> {
  className?: string,
  children?: ReactNode,
}

export const SubmitButton: FC<SubmitButtonProps> = ({ icon, children, ...props }) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isDisabled={pending} icon={pending ? 'arrow-rotate-right' : icon} {...props}>
      {children}
    </Button>
  );
};
