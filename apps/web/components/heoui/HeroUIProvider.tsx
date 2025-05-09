'use client';

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';
import { HeroUIProvider as Provider } from '@heroui/react';

export interface HeroUIProps {
  children: ReactNode;
}

export const HeroUIProvider = ({ children }: HeroUIProps) => {
  const router = useRouter();

  return (
    <Provider navigate={router.push}>
      {children}
    </Provider>
  );
};
