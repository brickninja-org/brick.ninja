import type { ReactNode } from 'react';

import { createContext, useContext, useLayoutEffect, useState } from 'react';

const tailwindCSSBreakIds = {
  mobile: 'mobile',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2xl': '2xl',
} as const;

export type TailwindCSSBreakId = keyof typeof tailwindCSSBreakIds;

const tailwindCSSBreaks = [
  { prefix: false, size: tailwindCSSBreakIds.mobile },
  { prefix: true, size: tailwindCSSBreakIds.sm },
  { prefix: true, size: tailwindCSSBreakIds.md },
  { prefix: true, size: tailwindCSSBreakIds.lg },
  { prefix: true, size: tailwindCSSBreakIds.xl },
  { prefix: true, size: tailwindCSSBreakIds['2xl'] },
];

const TailwindBreakpointContext = createContext<TailwindCSSBreakId | undefined>(tailwindCSSBreakIds.mobile);
const TailwindDarkModeContext = createContext<boolean>(false);

type TailwindProviderProps = {
  children: ReactNode;
};

export const TailwindProvider = ({ children }: TailwindProviderProps) => {
  const breakpoint = useTailwindBreakpointDetect();
  const darkMode = useTailwindDarkModeDetect();

  return (
    <>
      <div className="absolute top-0 left-0 w-0 h-0 dark:w-2 dark:h-2"
        id="darkmode-detect"/>
      <div className="w-2 h-2 sm:w-0 sm:h-0 md:w-0 md:h-0 lg:w-0 lg:h-0 xl:w-0 xl:h-0 2xl:w-0 2xl:h-0 absolute top-0 left-0"
        id="mobile-breakpoint-detect"/>
      <div className="w-0 h-0 sm:w-2 sm:h-2 md:w-0 md:h-0 lg:w-0 lg:h-0 xl:w-0 xl:h-0 2xl:w-0 2xl:h-0 absolute top-0 left-0"
        id="sm-breakpoint-detect"/>
      <div className="w-0 h-0 sm:w-0 sm:h-0 md:w-2 md:h-2 lg:w-0 lg:h-0 xl:w-0 xl:h-0 2xl:w-0 2xl:h-0 absolute top-0 left-0"
        id="md-breakpoint-detect"/>
      <div className="w-0 h-0 sm:w-0 sm:h-0 md:w-0 md:h-0 lg:w-2 lg:h-2 xl:w-0 xl:h-0 2xl:w-0 2xl:h-0 absolute top-0 left-0"
        id="lg-breakpoint-detect"/>
      <div className="w-0 h-0 sm:w-0 sm:h-0 md:w-0 md:h-0 lg:w-0 lg:h-0 xl:w-2 xl:h-2 2xl:w-0 2xl:h-0 absolute top-0 left-0"
        id="xl-breakpoint-detect"/>
      <div className="w-0 h-0 sm:w-0 sm:h-0 md:w-0 md:h-0 lg:w-0 lg:h-0 xl:w-0 xl:h-0 2xl:w-2 2xl:h-2 absolute top-0 left-0"
        id="2xl-breakpoint-detect"/>
      <TailwindBreakpointContext.Provider value={breakpoint}>
        <TailwindDarkModeContext.Provider value={darkMode}>
          {children}
        </TailwindDarkModeContext.Provider>
      </TailwindBreakpointContext.Provider>
    </>
  );
};

export const useTailwindBreakpoint = () => useContext(TailwindBreakpointContext);
export const useTailwindDarkMode = () => useContext(TailwindDarkModeContext);

export const useTailwindBreakpointDetect = () => {
  const [breakpoint, setBreakpoint] = useState<TailwindCSSBreakId>();

  const checkBreakpoint = () => {
    tailwindCSSBreaks.forEach((bp) => {
      const { size } = bp;
      const breakpointDetect = document.getElementById(`${size}-breakpoint-detect`);
      if (!breakpointDetect) {
        return;
      }

      if (breakpointDetect.clientWidth) {
        document.body.classList.add(size);
        setBreakpoint(size);
      } else {
        document.body.classList.remove(size);
      }
    });
  };

  useLayoutEffect(() => {
    checkBreakpoint();
  }, []);

  return breakpoint;
};

export const useTailwindDarkModeDetect = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const checkDarkMode = () => {
    const darkModeDetect = document.getElementById('darkmode-detect');
    if (!darkModeDetect) {
      return;
    }

    if (darkModeDetect.clientWidth) {
      document.body.classList.add('dark');
      setDarkMode(true);
    } else {
      document.body.classList.remove('dark');
    }
  };

  useLayoutEffect(() => {
    checkDarkMode();
  }, []);

  return darkMode;
};
