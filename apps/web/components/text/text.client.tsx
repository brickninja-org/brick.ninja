'use client';

import type { FC } from 'react';
import type { TextProps as TextPrimitiveProps } from 'react-aria-components';
import type { RefProp } from '@brickninja-org/ui/lib/react';

import { Text as TextPrimitive } from 'react-aria-components';
import { Slot as SlotPrimitive } from '@radix-ui/react-slot';

import { textVariants, type TextVariants } from './text.styles';

interface TextProps extends TextPrimitiveProps, TextVariants, RefProp<HTMLElement> {
  asChild?: boolean,
}

const Text: FC<TextProps> = ({ asChild = false, children, className, ref, size, variant, ...props }) => {
  const styles = textVariants({ size, variant, className });

  if (asChild) {
    return (
      <SlotPrimitive ref={ref} className={styles} {...props}>
        {children}
      </SlotPrimitive>
    );
  }

  return (
    <TextPrimitive ref={ref} className={styles} {...props}>
      {children}
    </TextPrimitive>
  );
};

Text.displayName = 'BrickCatalog.Text';

export type { TextProps };
export { Text };
