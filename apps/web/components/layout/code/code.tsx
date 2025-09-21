import type { FC, ReactNode } from 'react';
import type { CodeVariants } from './code.styles';

import { Source_Code_Pro } from 'next/font/google';
import { cn } from '@heroui/react';

import { codeVariants } from './code.styles';

const font = Source_Code_Pro({
  subsets: ['latin'],
  weight: 'variable',
  fallback: ['monospace'],
});

interface CodeProps extends CodeVariants {
  children: ReactNode,
}

const Code: FC<CodeProps> = ({ children, borderless = false, inline = false }) => {
  const styles = codeVariants({ borderless, inline });

  if (inline) {
    return (
      <code className={cn(styles, font.className)}>{children}</code>
    );
  }

  return (
    <pre className={cn(styles, font.className)}>
      <code>{children}</code>
    </pre>
  );
};

Code.displayName = 'BrickCatalog.Code';

export type { CodeProps };
export default Code;
