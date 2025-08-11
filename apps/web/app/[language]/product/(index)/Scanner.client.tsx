'use client';

import type { FC } from 'react';

import { Suspense, useCallback } from 'react';

// import { useTailwindBreakpoint } from '@/components/tailwind/Tailwind.context';
import { Scanner } from '@/components/barcode-scanner/Scanner';
import { BarcodeProvider, useBarcodes } from './Barcodes.context';

export const ScannerClient: FC = () => {
  // const breakpoint = useTailwindBreakpoint();
  const { codes, setCodes } = useBarcodes();

  const updateCodes = useCallback((codes: string[]) => {
    setCodes(codes);
  }, [setCodes]);

  const onScan = (code: string) => {
    if (!codes.includes(code)) {
      codes.unshift(code);
      updateCodes(codes);
    }
  };

  return (
    <BarcodeProvider>
      <Suspense fallback={<div>Loading scanner...</div>}>
        <div>
          <Scanner onScan={onScan}/>
        </div>
      </Suspense>
    </BarcodeProvider>
  );
};
