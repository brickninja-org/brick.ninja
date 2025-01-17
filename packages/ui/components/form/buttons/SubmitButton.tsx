'use client';

import type { FC } from 'react';
import type { ButtonProps } from '../Button';

import { useFormStatus } from 'react-dom';

import { Button } from '../Button';

export const SubmitButton: FC<ButtonProps> = ({ disabled, icon, iconColor, ...props }) => {
  const { pending } = useFormStatus();

  return <Button type="submit" disabled={disabled || pending} icon={pending ? 'loading' : icon} iconColor={pending ? undefined : iconColor} {...props}/>;
};
