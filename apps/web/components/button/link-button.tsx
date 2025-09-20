'use client';

import type { AnchorHTMLAttributes, FC } from 'react';
import type { ButtonProps } from '@heroui/react';
import type { RefProp } from '@brickninja-org/ui/lib/react';
import { Iconify, type IconName } from '@/components/iconify';

import Link from 'next/link';
import { buttonVariants } from '@heroui/react';

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement>, RefProp<HTMLAnchorElement>, Pick<ButtonProps, 'variant'> {
  href: string,
  isExternal?: boolean,
  icon?: IconName,
  prefetch?: boolean,
}

const LinkButton: FC<LinkButtonProps> = ({ ref, href, variant = 'secondary', icon, isExternal, className, children, ...props }) => {
  const LinkElement = isExternal ? 'a' : Link;

  return (
    <LinkElement ref={ref} href={href} className={buttonVariants({ variant, className })} {...props}>
      {icon && <Iconify icon={icon}/>}
      {children}
    </LinkElement>
  );
};

LinkButton.displayName = 'BrickCatalog.LinkButton';

export type { LinkButtonProps };
export { LinkButton };
