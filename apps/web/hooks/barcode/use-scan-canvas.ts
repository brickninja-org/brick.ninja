import type { BarcodeDetector, BarcodeDetectorOptions, BarcodeFormat, DetectedBarcode } from './types';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BARCODE_FORMAT } from './types';

declare let window: Window & typeof globalThis & {
  BarcodeDetector: BarcodeDetector;
};

type DetectedBarcodes = string[];

let barcodeDetector: BarcodeDetector;
const defaultBarcodeDetectorOptions = { useNative: false, formats: [BARCODE_FORMAT.EAN_13, BARCODE_FORMAT.UPC_A] };

const getBarcodeDetector = (options: BarcodeDetectorOptions) => {
  if (barcodeDetector) {
    return barcodeDetector;
  }

  const useNative = options.useNative && 'BarcodeDetector' in window;
  if (!useNative) {
    return null;
  }

  return window.BarcodeDetector.getSupportedFormats().then((formats: BarcodeFormat[]) => {
    if (formats.length === 0) {
      return Promise.reject('No barcode detection supported');
    }

    barcodeDetector = new window.BarcodeDetector(options) as unknown as BarcodeDetector;

    return Promise.resolve(barcodeDetector);
  });
};

type UseScanCanvasOptions = {
  barcodeDetectorOptions?: BarcodeDetectorOptions;
  hasPermission: boolean;
  onScan: (code: string) => void;
};

export const useScanCanvas = (options: UseScanCanvasOptions) => {
  const { barcodeDetectorOptions = defaultBarcodeDetectorOptions, hasPermission, onScan } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!(hasPermission && canvasRef.current)) {
      return;
    }

    setCanvas(canvasRef.current);
  }, [hasPermission]);

  const detectedBarcodesRef = useRef<DetectedBarcodes>([]);
  const [canDetect, setCanDetect] = useState<boolean>(true);

  const onDraw = useCallback(async (video?: HTMLVideoElement) => {
    if (!(canvas && canDetect)) {
      return undefined;
    }

    try {
      const barcodeDetector = await getBarcodeDetector(barcodeDetectorOptions);

      if (!canvas) {
        return undefined;
      }

      const detectionSource = video ?? await createImageBitmap(canvas);
      const detectedBarcodes = detectedBarcodesRef.current;

      try {
        const barcodes = await barcodeDetector?.detect(detectionSource);
        if (
          barcodes &&
          barcodes.length > 0 &&
          barcodes.filter((code: DetectedBarcode) => !detectedBarcodes.includes(code.rawValue))
        ) {
          barcodes.forEach((barcode: DetectedBarcode) => {
            if (detectedBarcodes.includes(barcode.rawValue)) {
              return;
            }

            detectedBarcodes.push(barcode.rawValue);
            onScan?.(barcode.rawValue);
          });
        }
      } catch (error) {
        console.log('unable to detect', error);
      } finally {
        if (detectionSource instanceof ImageBitmap) {
          detectionSource.close();
        }
      }
    } catch (error) {
      console.error('setting can detect to false', error);
      setCanDetect(false);
    }
  }, [barcodeDetectorOptions, canDetect, canvas, onScan]);

  return { canDetect, canvas, canvasRef, detectedBarcodesRef, onDraw };
};
