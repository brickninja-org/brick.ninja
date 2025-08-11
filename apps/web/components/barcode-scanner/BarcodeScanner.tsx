import type { ReactNode } from 'react';
import type { BarcodeDetectorOptions } from '@/hooks/barcode/types';
import type { DeviceChoiceOptions } from '@/hooks/camera/use-stream';

import { useRef } from 'react';
import { cn } from '@heroui/theme';
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

export const BarcodeScanner = ({
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
}: BarcodeScannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { canvasRef, hasPermission, webcamVideoRef } = useBarcodeScanner({
    barcodeDetectorOptions,
    deviceChoiceOptions,
    shouldPlay: false,
    zoom,
    onDevices,
    onScan,
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex justify-center relative overflow-hidden',
        'border-(--video-border)',
        'w-(--video-crop-width) h-(--video-crop-height)',
        '[--video-element-width:calc(var(--video-width)-var(--video-blur)*2)]',
        '[--video-element-height:calc(var(--video-height)-var(--video-blur)*2)]',
        '[--video-element-top:calc((var(--video-crop-height)-var(--video-element-height))/2-var(--video-blur))]',
        '[--video-element-left:calc((var(--video-crop-width)-var(--video-element-width))/2-var(--video-blur))]',
        '[--canvas-element-left:calc((var(--video-crop-width)-var(--canvas-width))/2-var(--video-blur))]',
        '[--canvas-element-top:calc((var(--video-crop-height)-var(--canvas-height))/2-var(--video-blur))]',
      )}
    >
      {hasPermission ? (
        <>
          <video
            ref={webcamVideoRef}
            className="absolute top-(--video-element-top) left-(--video-element-left) blur-(--video-blur)"
            width={videoWidth}
            height={videoHeight}
            autoPlay={autoStart}
            playsInline/>
          <canvas
            ref={canvasRef}
            className="absolute top-(--canvas-element-top) left-(--canvas-element-left) w-(--canvas-width) h-(--canvas-height)"
            width={canvasWidth}
            height={canvasHeight}/>
          <div
            className="
              absolute
              left-(--canvas-element-left)
              top-(--canvas-element-top)
              w-(--canvas-width) h-px
              overflow-hidden
              border-t-(--scanline)
              animate-scanline
            "/>
        </>
      ) : (
        waitElement
      )}
    </div>
  );
};
