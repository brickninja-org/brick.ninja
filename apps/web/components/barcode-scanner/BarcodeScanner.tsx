import type { CSSProperties, ReactNode } from 'react';
import type { BarcodeDetectorOptions } from '@/hooks/barcode/types';
import type { DeviceChoiceOptions } from '@/hooks/camera/use-stream';

import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@heroui/theme';
import { useBarcodeScanner } from './use-barcode-scanner';

export type BarcodeScannerProps = {
  animate?: boolean;
  autoStart?: boolean;
  barcodeDetectorOptions?: BarcodeDetectorOptions;
  blur?: number;
  canvasHeight?: number;
  canvasWidth?: number;
  className?: string;
  deviceChoiceOptions?: DeviceChoiceOptions;
  devices?: MediaDeviceInfo[];
  // preferDeviceLabelMatch?: RegExp;
  settings?: Record<string, string | RegExp>;
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
  animate = false,
  autoStart = true,
  barcodeDetectorOptions,
  blur = 0,
  canvasHeight = 480,
  canvasWidth = 640,
  className = '',
  deviceChoiceOptions,
  settings = {},
  videoCropHeight = 300,
  videoCropWidth = 640,
  videoHeight = 480,
  videoWidth = 640,
  waitElement = null,
  zoom = 1,
  onDevices,
  onScan,
}: BarcodeScannerProps) => {
  const { scanLine, videoBorder } = settings;

  const containerRef = useRef<HTMLDivElement>(null);

  const webcamScannerPreviewStyle = useMemo(() => ({
    '--scanline': scanLine,
    '--video-border': videoBorder,
    '--video-width': `${videoWidth}px`,
    '--video-height': `${videoHeight}px`,
    '--canvas-width': `${canvasWidth}px`,
    '--canvas-height': `${canvasHeight}px`,
    '--video-crop-width': `${videoCropWidth}px`,
    '--video-crop-height': `${videoCropHeight}px`,
    '--video-blur': `${blur}px`,
  } as CSSProperties), [scanLine, videoBorder, videoWidth, videoHeight, canvasWidth, canvasHeight, videoCropWidth, videoCropHeight, blur]);

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

    Object.entries(webcamScannerPreviewStyle).forEach(([key, value]) => {
      containerRef.current?.style.setProperty(key, value);
    });

    if (animate) {
      containerRef.current?.style.setProperty('animate-play-state', 'running');
    }
  }, [animate, hasPermission, webcamScannerPreviewStyle]);

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
        animate && 'animate-grow-scanner-container',
        className,
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
          {scanLine && <div className="absolute left-(--canvas-element-left) top-(--canvas-element-top) w-(--canvas-width) h-px overflow-hidden border-t-(--scanline) animate-scanline">-</div>}
        </>
      ) : (
        waitElement
      )}
    </div>
  );
};
