'use client';

import { useEffect, useState } from 'react';

import type { GetSets } from '@brickset-api/types/data/get-sets';

import type { TranslationSubset } from '@/lib/translate';
import { useFormatContext } from '@/components/format/format-context';
import { FormatCurrency } from '@/components/format/format-number.currency';
import { DataList } from '@/components/info-box/data-list';

interface PriceGuideProps {
  data: GetSets;
  translations: TranslationSubset<
    | 'priceGuide.official_price'
    | 'priceGuide.per_piece'
  >;
}

// Get the retailPrice by region from Brickset API and calculate the price per piece update when region changes
export function PriceGuide({ data, translations }: PriceGuideProps) {
  const { region } = useFormatContext();
  
  const [retailPrice, setRetailPrice] = useState<number | undefined>(undefined);

  // Set retail price base
  useEffect(() => {
    setRetailPrice(data.LEGOCom && data.LEGOCom[getBricksetApiRegion(region)].retailPrice);
  }, [region, data.LEGOCom]);

  return (
    <DataList data={[
      retailPrice && retailPrice >= 0 ? { label: translations['priceGuide.official_price'], value: <FormatCurrency value={retailPrice}/>, key: 'official-price' } : false,
      retailPrice && retailPrice > 0 ? { label: translations['priceGuide.per_piece'], value: <FormatCurrency value={retailPrice && (retailPrice / data.pieces)}/>, key: 'price-per-piece' } : false,
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

