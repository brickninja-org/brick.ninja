import type { FC } from 'react';
import type { IconName } from '@/components/iconify';
import type { ButtonProps as ButtonInternalProps } from './button.client';

import { Iconify } from '@/components/iconify';
import { Button as ButtonInternal } from './button.client';
import { cn } from '@heroui/react';

interface ButtonProps extends ButtonInternalProps {
  flex?: boolean,
  icon?: IconName,
}

const Button: FC<ButtonProps> = ({ children, className, flex, icon, ...props }) => {
  return (
    <ButtonInternal className={cn({ 'flex-1': flex, className })} {...props}>
      {icon && <Iconify icon={icon}/>}
      {typeof children === 'function' ? children({} as never) : children}
    </ButtonInternal>
  );
};

Button.displayName = 'BrickCatalog.Button';

export type { ButtonProps };
export { Button };
