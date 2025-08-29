'use client';

import type { FC } from 'react';
import type { ButtonProps } from '@heroui/react';

import { useFormStatus } from 'react-dom';
import { Button } from '@heroui/react';

export const SubmitButton: FC<Omit<ButtonProps, 'isDisabled' | 'isLoading' | 'type'>> = ({ radius, startContent, children, ...props }) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" {...props} startContent={!pending && startContent} isDisabled={pending} isLoading={pending} radius={radius || 'sm'}>
      {children}
    </Button>
  );
};
