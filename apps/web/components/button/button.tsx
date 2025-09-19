'use client';

import type { FC } from 'react';
import type { VariantProps } from 'tailwind-variants';
import type { IconName } from '@/components/iconify';
import type { ButtonProps as HeroUIButtonProps } from './button.client';

import { Iconify } from '@/components/iconify';
import { Button as HeroUIButton } from './button.client';
import { tv } from 'tailwind-variants';
import { buttonVariants as heroUIButtonVariants } from './button.styles';

const buttonVariants = tv({
  extend: heroUIButtonVariants,
  variants: {
    flex: {
      true: 'flex-1',
    },
  },
  defaultVariants: { flex: false },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;
interface ButtonProps extends Omit<HeroUIButtonProps, 'className'>, ButtonVariants {
  className?: string,
  icon?: IconName,
}

const Button: FC<ButtonProps> = ({ children, className, flex, icon, ...props }) => {
  return (
    <HeroUIButton className={buttonVariants({ flex, className })} {...props}>
      {(renderProps) => (
        <>
          {icon && <Iconify icon={icon}/>}
          {typeof children === 'function' ? children(renderProps) : children}
        </>
      )}
    </HeroUIButton>
  );
};

Button.displayName = 'BrickCatalog.Button';

export type { ButtonProps };
export { Button };
