'use client';

import type { FC, ReactNode } from 'react';
import type { ButtonProps } from '@/components/button';

import { useFormStatus } from 'react-dom';
import { Spinner } from '@heroui/react';

import { Button } from '@/components/button';
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
          {isPending ? <Spinner/> : icon && <Iconify icon={icon}/>}
          {isPending ? 'Submitting...' : children}
        </>
      )}
    </Button>
  );
};

SubmitButton.displayName = 'BrickCatalog.SubmitButton';

export type { SubmitButtonProps };
export { SubmitButton };
