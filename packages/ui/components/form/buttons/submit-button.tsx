'use client';

import type { FC } from 'react';
import { useFormStatus } from 'react-dom';

import { Button, type ButtonProps } from '../button';

export const SubmitButton: FC<ButtonProps> = ({ disabled, icon, ...props }) => {
  const { pending } = useFormStatus();

  return <Button type="submit" disabled={disabled || pending} icon={pending ? 'loading' : icon} {...props}/>;
};
