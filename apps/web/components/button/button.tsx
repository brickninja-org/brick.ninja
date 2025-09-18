import type { FC } from 'react';
import type { IconProp } from '@/components/iconify';
import type { ButtonProps as ButtonInternalProps } from './button.client';

import { Icon } from '@/components/iconify';
import { Button as ButtonInternal } from './button.client';
import { cn } from '@heroui/react';

interface ButtonProps extends ButtonInternalProps {
  flex?: boolean,
  icon?: IconProp,
}

const Button: FC<ButtonProps> = ({ children, className, flex, icon, ...props }) => {
  return (
    <ButtonInternal className={cn({ 'flex-1': flex, className })} {...props}>
      {icon && <Icon icon={icon}/>}
      {typeof children === 'function' ? children({} as never) : children}
    </ButtonInternal>
  );
};

Button.displayName = 'BrickCatalog.Button';

export type { ButtonProps };
export { Button };
