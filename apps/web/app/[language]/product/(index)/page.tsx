import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { db } from '@/lib/prisma';
import { Scanner } from '@/components/barcode-scanner/Scanner';
// import { Translate } from '@/components/i18n/Translate';
import { HeroLayout } from '@/components/layout/HeroLayout';

const getBarcodes = async () => {
  const items = await db.item.findMany({
    where: { barcode: { not: null }},
    select: { barcode: true },
  });

  return items.map((item) => item.barcode);
};

export default async function BarcodeScannerPage() {
  const codes = await getBarcodes();

  return (
    <HeroLayout hero={<Headline id="scanner">Barcode Scanner</Headline>}>
      <div>
        <Scanner onScanAction={(code) => {
          if (codes.includes(code)) {
            console.log(`Scanned barcode: ${code}`);
          } else {
            console.log(`Unknown barcode: ${code}`);
          }
        }}/>
      </div>
    </HeroLayout>
  );
}
