import type { FC, ButtonHTMLAttributes, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import type { VariantProps } from 'tailwind-variants';
import type { RefProp } from '../../lib/react';
import type { IconColor, IconProp } from '../../icons';

import Link from 'next/link';
import { tv } from 'tailwind-variants';

import { cn } from '../../lib';
import { Icon } from '../../icons';

const button = tv({
  base: [
    'group min-w-max inline-flex items-center gap-3 py-2 px-4',
    'text-foreground align-baseline whitespace-nowrap',
    'cursor-pointer',
    'border-none rounded-xs leading-5 shadow-[inset_0_0_0_1px] outline-none shadow-gray-300',
    'no-underline hover:no-underline',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:outline-hidden focus-visible:shadow-xs',
  ],
  variants: {
    appearance: {
      primary: 'bg-gray-100 shadow-gray-300 hover:not-disabled:bg-background font-semibold',
      secondary: 'bg-gray-100 shadow-gray-300 hover:not-disabled:bg-white',
      tertiary: 'bg-white hover:shadow-inset hover:not-disabled:bg-gray-200 hover:not-disabled:shadow-gray-300',
      menu: 'bg-transparent shadow-transparent text-left hover:not-disabled:bg-gray-100 hover:not-disabled:shadow-gray-100',
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

export interface ButtonProps extends CommonButtonProps, RefProp<HTMLButtonElement>, Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'form' | 'name' | 'value' | 'formAction' | 'aria-label'> {
  type?: 'button' | 'submit';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const Button: FC<ButtonProps> = ({ ref, appearance = 'secondary', flex, icon, iconColor, iconOnly, children, onClick, className, type = 'button', ...props }) => {
  return (
    <button ref={ref} type={type} onClick={onClick} className={cn(button({ appearance, flex, iconOnly }), className)} {...props}>
      {icon && <Icon icon={icon} color={iconColor}/>}
      {children}
    </button>
  );
};

export interface LinkButtonProps extends CommonButtonProps, RefProp<HTMLAnchorElement>, Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  href: string;
  locale?: string | false;
  prefetch?: boolean;
  external?: boolean;
}

export const LinkButton: FC<LinkButtonProps> = ({ ref, appearance, children, className, icon, iconColor, external, flex, fullWidth, ...props }) => {
  const LinkElement = external ? 'a' : Link;

  return (
    <LinkElement ref={ref} className={cn(button({ appearance, flex, fullWidth }), className)} {...props}>
      {icon && <Icon icon={icon} color={iconColor}/>}
      {children}
    </LinkElement>
  );
};
