import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import Link from 'next/link';
import { tv } from 'tailwind-variants';

import { cn } from '../../lib';

const buttonStyles = tv({
  base: 'w-auto inline-flex items-center gap-3 m-0 py-2 px-4 border-none rounded-sm leading-5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:shadow-sm',
  variants: {
    appearance: {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-white',
      tertiary: 'bg-background shadow-[0_0_0_1px] shadow-gray-200 hover:bg-gray-100',
      menu: 'bg-transparent shadow-[0_0_0_1px] shadow-transparent text-left hover:bg-gray-100',
    },
    flex: {
      true: 'flex-1',
    },
    iconOnly: {
      true: 'p-2 leading-4',
    },
  },
  defaultVariants: {
    appearance: 'primary',
  },
});

export interface CommonButtonProps extends Pick<HTMLAttributes<HTMLElement>, 'aria-label' | 'className'> {
  children?: ReactNode;
  appearance?: 'primary' | 'secondary' | 'tertiary' | 'menu';
  flex?: boolean;
  intent?: 'delete';
  iconOnly?: boolean;
}

export interface ButtonProps extends CommonButtonProps, Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'form' | 'name' | 'value' | 'formAction' | 'aria-label'> {
  type?: 'button' | 'submit';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ appearance = 'secondary', flex, iconOnly, children, onClick, className, type = 'button', ...props }, ref) {
  return (
    <button ref={ref} type={type} onClick={onClick} className={cn(buttonStyles({ appearance, flex, iconOnly }), className)} {...props}>
      {children && <span>{children}</span>}
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

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps & Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'>>(function Button({ appearance, children, className, external, flex, ...props }, ref) {
  const LinkElement = external ? 'a' : Link;

  return (
    <LinkElement ref={ref} className={cn(buttonStyles({ appearance, flex }), className)} {...props}>
      <span>{children}</span>
    </LinkElement>
  );
});
