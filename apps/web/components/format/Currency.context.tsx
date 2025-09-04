'use client';

import type { FC, ReactNode } from 'react';

import { createContext, useContext, useEffect, useState } from 'react';
import { useFormatContext } from './Format.context';
import { useHydrated } from '@/hooks/use-hydrated';

interface CurrencyContextProps {
  currency: string;
  setCurrency: (currency: string | 'auto') => void;
}

const regionToCurrency: Record<string, string> = {
  'US': 'USD',
  'CA': 'CAD',
  'GB': 'GBP',
  'DE': 'EUR',
  'ES': 'EUR',
  'FR': 'EUR',
  'NL': 'EUR',
};

const CurrencyContext = createContext<CurrencyContextProps>(null!);

export const useCurrency = () => useContext(CurrencyContext);

export interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: FC<CurrencyProviderProps> = ({ children }) => {
  const { region, defaultRegion } = useFormatContext();
  const [currency, setCurrency] = useState<string>('auto');

  const hydrated = useHydrated();

  // Load saved settings on hydration
  useEffect(() => {
    const storedCurrency = localStorage.getItem('bn.format.currency');
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);

  // auto-update currency when currency is 'auto' and region changes
  useEffect(() => {
    if (currency === 'auto') {
      const resolvedRegion = region === 'browser' ? defaultRegion : region;
      setCurrency(regionToCurrency[resolvedRegion] || 'USD');
    }
  }, [currency, region, defaultRegion]);

  // Save currency to localStorage
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem('bn.format.currency', currency);
  }, [currency, hydrated]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
