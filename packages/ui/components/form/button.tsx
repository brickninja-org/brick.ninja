import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import Link from 'next/link';

import { cn } from '../../lib';

const buttonStyles = 'inline-flex items-center m-0 py-2 px-4 border-none rounded-sm leading-normal';

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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ children, onClick, className, type = 'button', ...props }, ref) {
  return (
    <button ref={ref} type={type} onClick={onClick} className={cn(buttonStyles, className)} {...props}>
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

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps & Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'>>(function Button({ children, className, external, ...props }, ref) {
  const LinkElement = external ? 'a' : Link;

  return (
    <LinkElement ref={ref} className={cn(buttonStyles, className)} {...props}>
      <span>{children}</span>
    </LinkElement>
  );
});
