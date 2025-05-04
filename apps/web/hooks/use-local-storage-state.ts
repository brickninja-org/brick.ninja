import { useEffect, useState } from 'react';

import { useHydrated } from './use-hydrated';

export function useLocalStorageState<S = undefined>(key: string, initial: S | (() => S)) {
  const [state, setState] = useState(initial);
  const hydrated = useHydrated();

  useEffect(() => {
    if(localStorage[`bn.${key}`]) {
      setState(JSON.parse(localStorage[`bn.${key}`]));
    }
  }, [key]);

  useEffect(() => {
    if(!hydrated) {
      return;
    }

    localStorage.setItem(`bn.${key}`, JSON.stringify(state));
  }, [hydrated, key, state]);

  return [state, setState] as const;
}
