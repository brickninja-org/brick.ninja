'use client';

import type { FC, ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';
import type { IconProps } from '@iconify/react';
import type { ButtonProps } from '@/components/button';

import { useFormStatus } from 'react-dom';
import { tv } from 'tailwind-variants';

import { Button, buttonVariants } from '@/components/button';
import { Iconify } from '@/components/iconify/iconify.client';
import { Spinner } from '@/components/spinner';

const submitButtonVariants = tv({
  extend: buttonVariants,
  variants: {
    flex: {
      true: 'flex-1',
    },
  },
});

type SubmitButtonVariants = VariantProps<typeof submitButtonVariants>;
export interface SubmitButtonProps extends Omit<ButtonProps, 'asChild' | 'children' | 'className' | 'isPending' | 'type'>, SubmitButtonVariants {
  className?: string,
  icon?: IconProps['icon'],
  children?: ReactNode,
}

export const SubmitButton: FC<SubmitButtonProps> = ({ flex, isPending, icon, className, children, ...props }) => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isDisabled={pending} isPending={pending} className={submitButtonVariants({ flex, isPending, className })} {...props}>
      {({ isPending }) => (
        <>
          {isPending ? <Spinner/> : icon ? <Iconify icon={icon}/> : null}
          {isPending ? 'Submitting...' : children}
        </>
      )}
    </Button>
  );
};
