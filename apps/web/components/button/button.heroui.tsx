'use client';

import type { FC } from 'react';
import type { ButtonProps as ButtonPrimitiveProps } from 'react-aria-components';
import type { ButtonVariants } from './button.styles';

import React from 'react';
import { Button as ButtonPrimitive } from 'react-aria-components';
import { Slot as SlotPrimitive } from '@radix-ui/react-slot';

import { composeTwRenderProps } from '../../utils';

import { buttonVariants } from './button.styles';
import type { RefProp } from '@brickninja-org/ui/lib/react';

interface ButtonProps extends ButtonPrimitiveProps, ButtonVariants, RefProp<HTMLButtonElement> {
  asChild?: boolean,
}

const Button: FC<ButtonProps> = ({ asChild, children, className, isIconOnly, ref, size, slot, style, variant, ...props }) => {
  const styles = buttonVariants({
    isIconOnly,
    size,
    variant,
    class: typeof className === 'string' ? className : undefined,
  });

  if (asChild) {
    return (
      <SlotPrimitive
        className={styles}
        slot={slot as string}
        style={style as React.CSSProperties}
        {...props}
      >
        {typeof children === 'function' ? children({} as never) : children}
      </SlotPrimitive>
    );
  }

  return (
    <ButtonPrimitive
      ref={ref}
      className={composeTwRenderProps(className, styles)}
      slot={slot}
      style={style}
      {...props}
    >
      {(renderProps) => (typeof children === 'function' ? children(renderProps) : children)}
    </ButtonPrimitive>
  );
};

Button.displayName = 'HeroUI.Button';

export type { ButtonProps };
export { Button };
