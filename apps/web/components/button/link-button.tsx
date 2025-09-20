'use client';

import type { FC } from 'react';
import type { ButtonProps, LinkProps } from '@heroui/react';

import { buttonVariants, Link } from '@heroui/react';

interface LinkButtonProps extends LinkProps, Pick<ButtonProps, 'variant'> {
  href: string,
  className?: string,
  children: React.ReactNode,
}

const LinkButton: FC<LinkButtonProps> = ({ href, variant, className, children, ...props }) => {
  return (
    <Link href={href} className={buttonVariants({ variant, className })} {...props}>
      {typeof children === 'string' ? (
        <>
          {children}
        </>
      ) : children}
    </Link>
  );
};

LinkButton.displayName = 'BrickCatalog.LinkButton';

export type { LinkButtonProps };
export { LinkButton };
