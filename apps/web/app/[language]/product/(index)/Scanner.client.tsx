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
      <Suspense>
        <div id="scan-list" className="relative w-full h-hull">
          <div className="flex flex-col justify-center h-full w-full">
            {codes.length > 0
              ? (
                  <div>
                    <p>Scanned ({codes.length})</p>
                  </div>
                )
              : (
                  <div>
                    <p>No barcodes scanned</p>
                  </div>
                )}
          </div>
        </div>
      </Suspense>
    </BarcodeProvider>
  );
};
