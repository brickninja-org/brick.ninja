import { Headline } from '@brickninja-org/ui/components/headline/Headline';

// import { db } from '@/lib/prisma';
// import { Translate } from '@/components/i18n/Translate';
import { HeroLayout } from '@/components/layout/HeroLayout';
// import { isTruthy } from '@brickninja-org/helper/is';
import { ScannerClient } from './Scanner.client';

/*
const getBarcodes = async () => {
  const items = await db.item.findMany({
    where: { barcode: { not: null }},
    select: { barcode: true },
  });

  return items.map((item) => item.barcode).filter(isTruthy);
};
*/

export default function BarcodeScannerPage() {
  // const barcodes = await getBarcodes();

  return (
    <HeroLayout hero={<Headline id="scanner">Barcode Scanner</Headline>}>
      <div>
        <ScannerClient/>
      </div>
    </HeroLayout>
  );
}
