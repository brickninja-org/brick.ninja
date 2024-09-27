import React, { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import Link from 'next/link';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '../../lib';
import { Icon, type IconColor, type IconProp } from '../../icons';

const button = tv({
  base: [
    'group min-w-max inline-flex items-center gap-3 py-2 px-4 border-none rounded-sm shadow-[inset_0_0_0_1px] shadow-gray-300 leading-5 text-black whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:shadow-sm',
  ],
  variants: {
    appearance: {
      primary: 'bg-gray-100 shadow-gray-300 hover:[&:not(:disabled)]:bg-white font-semibold',
      secondary: 'bg-gray-100 shadow-gray-300 hover:[&:not(:disabled)]:bg-white',
      tertiary: 'bg-white shadow-gray-200 hover:[&:not(:disabled)]:bg-gray-100 hover:[&:not(:disabled)]:shadow-gray-300',
      menu: 'bg-transparent shadow-transparent text-left hover:[&:not(:disabled)]:bg-gray-200 hover:[&:not(:disabled)]:shadow-gray-200',
    },
    flex: {
      true: 'flex-1',
    },
    fullWidth: {
      true: 'w-full',
    },
    iconOnly: {
      true: 'p-2 leading-4',
    },
  },
  defaultVariants: {
    appearance: 'secondary',
    color: 'default',
    fullWidth: false,
  },
});

export type ButtonVariantProps = VariantProps<typeof button>;

export interface CommonButtonProps extends Pick<HTMLAttributes<HTMLElement>, 'aria-label' | 'className'>, ButtonVariantProps {
  icon?: IconProp;
  iconColor?: IconColor;
  children?: ReactNode;
}

export interface ButtonProps extends CommonButtonProps, Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'form' | 'name' | 'value' | 'formAction' | 'aria-label'> {
  type?: 'button' | 'submit';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ appearance = 'secondary', flex, icon, iconColor, iconOnly, children, onClick, className, type = 'button', ...props }, ref) {
  return (
    <button ref={ref} type={type} onClick={onClick} className={cn(button({ appearance, flex, iconOnly }), className)} {...props}>
      {icon && <Icon icon={icon} color={iconColor}/>}
      {children}
    </button>
  );
});

export interface LinkButtonProps extends CommonButtonProps {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  href: string;
  locale?: string | false;
  prefetch?: boolean;
  external?: boolean;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps & Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'>>(function Button({ appearance, children, className, icon, iconColor, external, flex, fullWidth, ...props }, ref) {
  const LinkElement = external ? 'a' : Link;

  return (
    <LinkElement ref={ref} className={cn(button({ appearance, flex, fullWidth }), className)} {...props}>
      {icon && <Icon icon={icon} color={iconColor}/>}
      {children}
    </LinkElement>
  );
});
