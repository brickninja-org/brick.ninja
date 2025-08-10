export type ValueOf<T> = T[keyof T];

export const BARCODE_FORMAT = {
  EAN_8: 'ean_8',
  EAN_13: 'ean_13',
  QR_CODE: 'qr_code',
  UPC_A: 'upc_a',
  UPC_E: 'upc_e',
  UNKNOWN: 'unknown',
} as const;
export type BarcodeFormat = ValueOf<typeof BARCODE_FORMAT>;

export type DetectedBarcode = {
  boundingBox: DOMRectReadOnly;
  cornerPoints: [number, number, number, number];
  format: BarcodeFormat;
  rawValue: string;
};

export type BarcodeDetectorOptions = {
  useNative?: boolean;
  formats?: BarcodeFormat[];
};

interface BarcodeDetectorClass {
  new (options: BarcodeDetectorOptions): BarcodeDetector;
}

export type BarcodeDetector = BarcodeDetectorClass & {
  getSupportedFormats: () => Promise<BarcodeFormat[]>;
  detect: (source: ImageBitmapSource) => Promise<DetectedBarcode[]>;
};
