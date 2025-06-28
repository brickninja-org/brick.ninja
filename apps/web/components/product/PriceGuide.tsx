import type { FC } from 'react';
import type { Product } from '@brickninjaapi/types/data/product';
import type { TranslationSubset } from '@/lib/translate';

import { useEffect, useState } from 'react';
import { useFormatContext } from '@/components/format/Format.context';
import { DataList } from '@/components/info-box/DataList';
import { FormatNumber } from '../format/FormatNumber';

interface PriceGuideProps {
  data: Product;
  translations: TranslationSubset<
    | 'priceGuide.rrp'
    | 'priceGuide.ppp'
  >;
}

export const PriceGuide: FC<PriceGuideProps> = ({ data, translations }) => {
  const { currency, region } = useFormatContext();
  const [rrp, setRrp] = useState<number | undefined>(undefined);

  useEffect(() => {
    setRrp(data.region_info && data.region_info[getApiRegion(region)]?.price);
  }, [data, region]);

  return (
    <DataList data={[
      rrp && rrp >= 0 ? { label: translations['priceGuide.rrp'], value: <FormatNumber value={rrp} options={{ style: 'currency', currency, currencyDisplay: 'narrowSymbol' }}/>, key: 'rrp' } : false,
      rrp && rrp > 0 && data.details?.attributes ? { label: translations['priceGuide.ppp'], value: <FormatNumber value={(data.details.attributes.find((attr) => attr.type === 'pieceCount')?.value as number) / rrp} options={{ style: 'currency', currency, currencyDisplay: 'narrowSymbol' }}/>, key: 'ppp' } : false
    ]}/>
  );
};

function getApiRegion(region: string) {
  switch (region) {
    case 'BE':
    case 'DE':
    case 'NL':
      return 'DE';
    case 'GB':
    case 'UK':
      return 'GB';
    case 'CA':
      return 'CA';
    default:
      return 'US';
  }
}
