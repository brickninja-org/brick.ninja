'use client';

import type { FC, ReactNode } from 'react';
import type { ButtonProps } from '@/components/button';

import { useFormStatus } from 'react-dom';
import { Button, Spinner } from '@heroui/react';

import { Iconify } from '@/components/iconify';

interface SubmitButtonProps extends Omit<ButtonProps, 'asChild' | 'children' | 'isPending' | 'type'> {
  children: ReactNode,
}

const SubmitButton: FC<SubmitButtonProps> = ({ icon, children, ...props }) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isDisabled={pending} isPending={pending} {...props}>
      {({ isPending }) => (
        <>
          {isPending ? <Spinner size="sm"/> : icon && <Iconify icon={icon}/>}
          {isPending ? 'Submitting...' : children}
        </>
      )}
    </Button>
  );
};

export type { SubmitButtonProps };
export { SubmitButton };
