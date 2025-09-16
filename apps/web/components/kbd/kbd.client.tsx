'use client';

import type { FC, ReactNode } from 'react';
import type { RefProp } from '@brickninja-org/ui/lib/react';
import type { KbdKey } from './kbd.constants';

import { createContext, useContext, useMemo } from 'react';

import { kbdKeysLabelMap, kbdKeysMap } from './kbd.constants';
import { kbdVariants } from './kbd.styles';

const KbdContext = createContext<{
  slots?: ReturnType<typeof kbdVariants>,
}>({});

/* -------------------------------------------------------------------------------------------------
 * Kbd
 * -----------------------------------------------------------------------------------------------*/

interface KbdProps extends React.HTMLAttributes<HTMLElement>, RefProp<HTMLElement> {
  children: React.ReactNode,
  className?: string,
}

const KbdRoot: FC<KbdProps> = ({ ref, children, className, ...props }) => {
  const slots = useMemo(() => kbdVariants(), []);

  return (
    <KbdContext.Provider value={{ slots }}>
      <kbd ref={ref} {...props} className={slots.base({ className })}>
        {children}
      </kbd>
    </KbdContext.Provider>
  );
};

KbdRoot.displayName = 'BrickCatalog.Kbd';

/* -----------------------------------------------------------------------------------------------*/

interface KbdAbbrProps extends React.HTMLAttributes<HTMLElement>, RefProp<HTMLElement> {
  className?: string,
  /**
   * The keyboard key to display
   */
  keyValue: KbdKey,
}

const KbdAbbr: FC<KbdAbbrProps> = ({ ref, className, keyValue, ...props }) => {
  const { slots } = useContext(KbdContext);

  return (
    <abbr
      ref={ref}
      className={slots?.abbr({ className })}
      title={kbdKeysLabelMap[keyValue]}
      {...props}
    >
      {kbdKeysMap[keyValue]}
    </abbr>
  );
};

KbdAbbr.displayName = 'BrickCatalog.Kbd.Abbr';

/* -----------------------------------------------------------------------------------------------*/

interface KbdContentProps extends React.HTMLAttributes<HTMLSpanElement>, RefProp<HTMLSpanElement> {
  children: ReactNode,
  className?: string,
}

const KbdContent: FC<KbdContentProps> = ({ ref, children, className, ...props }) => {
  const { slots } = useContext(KbdContext);

  return (
    <span ref={ref} className={slots?.content({ className })} {...props}>
      {children}
    </span>
  );
};

KbdContent.displayName = 'BrickCatalog.Kbd.Content';

/* -----------------------------------------------------------------------------------------------*/

const CompoundKbd = Object.assign(KbdRoot, {
  Abbr: KbdAbbr,
  Content: KbdContent,
});

export type { KbdProps, KbdAbbrProps, KbdContentProps };
export default CompoundKbd;
