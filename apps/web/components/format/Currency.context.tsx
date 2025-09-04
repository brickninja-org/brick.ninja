'use client';

import type { FC, ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { useHydrated } from '@/hooks/use-hydrated';
import { useFormatContext } from '@/components/format/Format.context';

interface CurrencyContextProps {
  currency: string;
  setCurrency: (currency: string | 'auto') => void;
}

const regionToCurrency: Record<string, string> = {
  US: 'USD',
  CA: 'CAD',
  GB: 'GBP',
  DE: 'EUR',
  ES: 'EUR',
  FR: 'EUR',
  NL: 'EUR',
};

const CurrencyContext = createContext<CurrencyContextProps>(null!);

export const useCurrency = () => useContext(CurrencyContext);

export interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: FC<CurrencyProviderProps> = ({ children }) => {
  const { region, defaultRegion } = useFormatContext();
  const [currency, setCurrencyState] = useState<string>('auto');
  const hydrated = useHydrated();

  // handmatig gekozen currency (null = automatisch)
  const [manualCurrency, setManualCurrency] = useState<string | null>(null);

  // laad voorkeur bij hydration
  useEffect(() => {
    const storedCurrency = localStorage.getItem('bn.format.currency');
    if (storedCurrency) {
      if (storedCurrency === 'auto') {
        setManualCurrency(null);
      } else {
        setManualCurrency(storedCurrency);
      }
    }
  }, []);

  // update currency afhankelijk van region óf override
  useEffect(() => {
    if (manualCurrency) {
      setCurrencyState(manualCurrency);
    } else {
      const resolvedRegion = region === 'browser' ? defaultRegion : region;
      setCurrencyState(regionToCurrency[resolvedRegion] || 'USD');
    }
  }, [manualCurrency, region, defaultRegion]);

  // sla voorkeur op
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('bn.format.currency', manualCurrency ?? 'auto');
  }, [manualCurrency, hydrated]);

  const setCurrency = (value: string | 'auto') => {
    if (value === 'auto') {
      setManualCurrency(null);
    } else {
      setManualCurrency(value);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
