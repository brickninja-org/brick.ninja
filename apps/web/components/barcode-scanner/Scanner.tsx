import type { FC } from 'react';

import { useState } from 'react';
import { useTailwindBreakpoint } from '../tailwind/Tailwind.context';
import { BarcodeScanner } from './BarcodeScanner';

export type ScannerProps = {
  onScan: (code: string) => void,
};

const SCANNER_SIZES = {
  NONE: { height: 0, width: 0, cropWidthRatio: 1 },
  XS: { height: 240, width: 320, cropWidthRatio: 0.9 },
  SM: { height: 376, width: 480, cropWidthRatio: 0.6 },
  MD: { height: 376, width: 480, cropWidthRatio: 1 },
  LG: { height: 480, width: 640, cropWidthRatio: 1 },
};

export const ScannerSizes = {
  'loading': SCANNER_SIZES.NONE,
  'mobile': SCANNER_SIZES.SM,
  'sm': SCANNER_SIZES.MD,
  'md': SCANNER_SIZES.MD,
  'lg': SCANNER_SIZES.MD,
  'xl': SCANNER_SIZES.LG,
  '2xl': SCANNER_SIZES.LG,
  'forced-xs': SCANNER_SIZES.XS,
  'forced-sm': SCANNER_SIZES.SM,
  'forced-md': SCANNER_SIZES.MD,
  'forced-lg': SCANNER_SIZES.LG,
} as const;

export const Scanner: FC<ScannerProps> = ({ onScan }) => {
  const breakpoint = useTailwindBreakpoint() ?? 'loading';

  const [forcedSize, setForcedSize] = useState<keyof typeof ScannerSizes>();
  void setForcedSize;

  const [codes, setCodes] = useState<string[]>([]);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const {
    canvasHeight = ScannerSizes[forcedSize ?? breakpoint].height,
    canvasWidth = ScannerSizes[forcedSize ?? breakpoint].width,
    videoHeight = ScannerSizes[forcedSize ?? breakpoint].height,
    videoWidth = ScannerSizes[forcedSize ?? breakpoint].width,
    videoCropWidth = ScannerSizes[forcedSize ?? breakpoint].width * ScannerSizes[forcedSize ?? breakpoint].cropWidthRatio,
    videoCropHeight = ScannerSizes[forcedSize ?? breakpoint].height * 0.5,
    zoom = 1
  } = {};

  const doScan = (code: string) => {
    if (codes.includes(code)) {
      return;
    }
    codes.push(code);
    setCodes(codes);
    onScan(code);
  };

  const onDevices = (devices: MediaDeviceInfo[]) => {
    setDevices(devices);
  };

  return (
    <div
      id=""
      className="relative border-red-300 box-content rounded-2xl"
      style={{
        width: `${videoCropWidth}px`,
        height: `${videoCropHeight}px`,
        borderWidth: breakpoint === 'mobile' ? '0.25rem' : '0.35rem',
      }}
    >
      <BarcodeScanner
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        devices={devices}
        videoCropHeight={videoCropHeight}
        videoCropWidth={videoCropWidth}
        videoHeight={videoHeight}
        videoWidth={videoWidth}
        zoom={zoom}
        onDevices={onDevices}
        onScan={doScan}/>
    </div>
  );
};
