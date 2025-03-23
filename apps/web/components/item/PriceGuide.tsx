'use client';

import type { GetSets } from '@brickset-api/types/data/get-sets';
import type { TranslationSubset } from '@/lib/translate';

import { useEffect, useState } from 'react';

import { useFormatContext } from '@/components/format/Format.context';
import { FormatNumber } from '@/components/format/FormatNumber';
import { DataList } from '@/components/info-box/DataList';

interface PriceGuideProps {
  data: GetSets;
  translations: TranslationSubset<
    | 'priceGuide.official_price'
    | 'priceGuide.per_piece'
  >;
}

// Get the retailPrice by region from Brickset API and calculate the price per piece update when region changes
export function PriceGuide({ data, translations }: PriceGuideProps) {
  const { currency, region } = useFormatContext();

  const [retailPrice, setRetailPrice] = useState<number | undefined>(undefined);

  // Set retail price base
  useEffect(() => {
    setRetailPrice(data.LEGOCom && data.LEGOCom[getBricksetApiRegion(region)].retailPrice);
  }, [region, data.LEGOCom]);

  return (
    <DataList data={[
      retailPrice && retailPrice >= 0 ? { label: translations['priceGuide.official_price'], value: <FormatNumber value={retailPrice} options={{ style: 'currency', currency, currencyDisplay: 'narrowSymbol' }}/>, key: 'official-price' } : false,
      retailPrice && retailPrice > 0 ? { label: translations['priceGuide.per_piece'], value: <FormatNumber value={retailPrice && (retailPrice / data.pieces)} options={{ style: 'currency', currency, currencyDisplay: 'narrowSymbol' }}/>, key: 'price-per-piece' } : false,
    ]}/>
  );
}

function getBricksetApiRegion(region: string) {
  switch (region) {
    case 'NL':
    case 'DE':
    case 'BE':
      return 'DE';
    case 'UK':
    case 'GB':
      return 'UK';
    case 'CA':
      return 'CA';
    default:
      return 'US';
  }
}
