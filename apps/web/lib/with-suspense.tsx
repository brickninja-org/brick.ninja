import type { FC, ReactNode } from 'react';

import { createElement, Suspense } from 'react';

export function withSuspense<T extends object>(Component: FC<T>, fallback?: ReactNode): FC<T> {
  const wrapped: FC<T> = (props) => (
    <Suspense fallback={fallback}>
      {createElement(Component, props)}
    </Suspense>
  );

  wrapped.displayName = `withSuspense(${Component.displayName ?? Component.name})`;

  return wrapped;
}
