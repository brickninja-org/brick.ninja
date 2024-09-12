import type { FC, ReactNode } from 'react';
import { Source_Code_Pro } from 'next/font/google';
import { tv } from 'tailwind-variants';
import { cn } from '@brickninja-org/ui/lib';

interface CodeProps {
  children: ReactNode;
  borderless?: boolean;
  inline?: boolean;
}

const font = Source_Code_Pro({
  subsets: ['latin'],
  weight: 'variable',
  fallback: ['monospace'],
});

const code = tv({
  base: 'my-4 border-l bg-gray-50 text-gray-700 text-sm overflow-x-auto',
  variants: {
    borderless: {
      true: '-ml-4 p-4 rounded-e-sm border-l-0',
    },
    inline: {
      true: 'px-2 bg-gray-50 text-inherit',
      false: 'px-4',
    },
  },
  defaultVariants: {
    borderless: false,
    inline: false,
  },
});

export const Code: FC<CodeProps> = ({ children, borderless = false, inline = false }) => {
  if (inline) {
    return (
      <code className={cn(code({ borderless, inline }), font.className)}>{children}</code>
    );
  }

  return (
    <pre className={cn(code({ borderless, inline }), font.className)}>
      <code>{children}</code>
    </pre>
  );
};
