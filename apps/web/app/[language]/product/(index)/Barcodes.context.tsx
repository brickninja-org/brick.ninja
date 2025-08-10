import type { ReactNode } from 'react';

import { createContext, use, useState } from 'react';

export type Barcodes = string[];
export type BarcodeProviderProps = { children: ReactNode };

const BarcodeContext = createContext<{ codes: Barcodes; setCodes: (codes: Barcodes) => void }>({ codes: [], setCodes: () => undefined });

export const useBarcodes = () => use(BarcodeContext);

export const BarcodeProvider = ({ children }: BarcodeProviderProps) => {
  const [codes, setCodes] = useState<Barcodes>([]);

  return (
    <BarcodeContext.Provider value={{ codes, setCodes }}>
      {children}
    </BarcodeContext.Provider>
  );
};
