import type { BarcodeDetectorOptions } from '@/hooks/barcode/types';
import type { DeviceChoiceOptions } from '@/hooks/camera/use-stream';

import { useEffect, useRef, type ReactNode } from 'react';

import { useBarcodeScanner } from './use-barcode-scanner';

export type BarcodeScannerProps = {
  autoStart?: boolean;
  barcodeDetectorOptions?: BarcodeDetectorOptions;
  blur?: number;
  canvasHeight?: number;
  canvasWidth?: number;
  deviceChoiceOptions?: DeviceChoiceOptions;
  devices?: MediaDeviceInfo[];
  videoCropHeight?: number;
  videoCropWidth?: number;
  videoHeight?: number;
  videoWidth?: number;
  waitElement?: ReactNode;
  zoom?: number;
  onDevices?: (devices: MediaDeviceInfo[]) => void;
  onScan: (code: string) => void;
};

export const BarcodeScanner = (props: BarcodeScannerProps) => {
  const {
    autoStart = true,
    barcodeDetectorOptions,
    canvasHeight = 480,
    canvasWidth = 640,
    deviceChoiceOptions,
    waitElement = null,
    videoHeight = 480,
    videoWidth = 640,
    zoom = 1,
    onDevices,
    onScan,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const { canvasRef, hasPermission, webcamVideoRef } = useBarcodeScanner({
    barcodeDetectorOptions,
    deviceChoiceOptions,
    shouldPlay: false,
    zoom,
    onDevices,
    onScan,
  });

  useEffect(() => {
    if (!hasPermission || !containerRef.current) {
      return;
    }
  }, [hasPermission]);

  return (
    <div ref={containerRef}>
      {hasPermission
        ? (
          <>
            <video
              ref={webcamVideoRef}
              width={videoWidth}
              height={videoHeight}
              autoPlay={autoStart}
              playsInline/>
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}/>
          </>
        )
        : waitElement
      }
    </div>
  );
};
