'use client';

import type { AnchorHTMLAttributes, FC } from 'react';
import type { ButtonProps } from '@heroui/react';

import { buttonVariants } from '@heroui/react';

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement>, Pick<ButtonProps, 'variant'> {
}

const LinkButton: FC<LinkButtonProps> = ({ href, variant, className, children, ...props }) => {
  return (
    <a href={href} className={buttonVariants({ variant, className })} {...props}>
      {children}
    </a>
  );
};

LinkButton.displayName = 'BrickCatalog.LinkButton';

export type { LinkButtonProps };
export { LinkButton };
