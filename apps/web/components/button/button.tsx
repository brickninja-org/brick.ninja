import type { FC } from 'react';
import type { IconName } from '@/components/iconify';
import type { ButtonProps as HeroUIButtonProps } from './button.client';

import { Iconify } from '@/components/iconify';
import { Button as HeroUIButton } from './button.client';
import { cn } from '@heroui/react';

interface ButtonProps extends HeroUIButtonProps {
  flex?: boolean,
  icon?: IconName,
}

const Button: FC<ButtonProps> = ({ children, className, flex, icon, ...props }) => {
  return (
    <HeroUIButton className={cn({ 'flex-1': flex, className })} {...props}>
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
