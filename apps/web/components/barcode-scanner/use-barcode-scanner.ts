import type { DeviceChoiceOptions } from '@/hooks/camera/use-stream';
import type { BarcodeDetectorOptions } from '@/hooks/barcode/types';

import { useScanCanvas } from '@/hooks/barcode/use-scan-canvas';
import { useWebcam } from '@/hooks/camera/use-webcam';
import { useVideoCanvas } from '@/hooks/camera/use-video-canvas';

export type UseBarcodeScannerOptions = {
  barcodeDetectorOptions?: BarcodeDetectorOptions;
  deviceChoiceOptions?: DeviceChoiceOptions;
  shouldPlay?: boolean;
  zoom?: number;
  onDevices?: (deviceList: MediaDeviceInfo[]) => void;
  onScan: (barcode: string) => void;
};

export const useBarcodeScanner = (options: UseBarcodeScannerOptions) => {
  const {
    barcodeDetectorOptions,
    deviceChoiceOptions,
    shouldPlay = true,
    zoom = 1,
    onDevices,
    onScan
  } = options;

  const { hasPermission, stream, trackSettings, webcamVideo, webcamVideoRef } = useWebcam({ deviceChoiceOptions, onDevices });

  const { canDetect, canvas, canvasRef, detectedBarcodesRef, onDraw } = useScanCanvas({ barcodeDetectorOptions, hasPermission, onScan });

  useVideoCanvas({
    canvas,
    hasPermission,
    onDraw,
    shouldDraw: canDetect,
    shouldPlay,
    trackSettings,
    webcamVideo,
    zoom,
  });

  return {
    canvasRef,
    detectedBarcodes: detectedBarcodesRef.current,
    hasPermission,
    stream,
    webcamVideoRef,
  };
};
