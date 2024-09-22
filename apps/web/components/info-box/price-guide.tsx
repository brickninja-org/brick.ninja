'use client';

import { useEffect, useState } from 'react';

import type { GetSets } from '@brickset-api/types/data/get-sets';

import { useFormatContext } from '@/components/format/format-context';
import { FormatCurrency } from '@/components/format/format-currency';
import { DataList } from '@/components/info-box/data-list';

interface PriceGuideProps {
  data: GetSets;
}

// Get the retailPrice by region from Brickset API and calculate the price per piece update when region changes
export function PriceGuide({ data }: PriceGuideProps) {
  const { region } = useFormatContext();
  
  const [retailPrice, setRetailPrice] = useState<number | undefined>();

  // Set retail price base
  useEffect(() => {
    setRetailPrice(data.LEGOCom && data.LEGOCom[getBricksetApiRegion(region)].retailPrice);
  }, [region, data.LEGOCom]);

  return (
    <DataList data={[
      { label: 'Official Price', value: <FormatCurrency value={retailPrice}/>, key: 'official-price' },
      { label: 'Per Piece', value: <FormatCurrency value={retailPrice && (retailPrice / data.pieces)}/>, key: 'price-per-piece' },
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

