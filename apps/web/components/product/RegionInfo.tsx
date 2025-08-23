'use client';

import type { FC } from 'react';
import type { Product, RegionInfo as RegionInfoData } from '@brickninjaapi/types/data/product';
import type { TranslationSubset } from '@/lib/translate';

import { useEffect, useState } from 'react';
import { fetchBrickNinjaApi } from '@brickninjaapi/fetch';

import { useFormatContext } from '@/components/format/Format.context';
import { DataList } from '@/components/info-box/DataList';
import { FormatNumber } from '@/components/format/FormatNumber';

interface RegionInfoProps {
  data: Product;
  translations: TranslationSubset<
    | 'priceGuide.rrp'
    | 'priceGuide.ppp'
    // | 'regionInfo.points'
  >;
}

export const RegionInfo: FC<RegionInfoProps> = ({ data, translations }) => {
  const { currency, region } = useFormatContext();
  const [regionData, setRegionData] = useState<RegionInfoData>();
  // const [rrp, setRrp] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchBrickNinjaApi(`/v1/products/${data.id}/region-info`).then(setRegionData);
    // setRrp(data.details?.region_info && (data.details.region_info[getApiRegion(region)]?.price / 100) || undefined);
  }, [data, region]);

  const currentRegion = getApiRegion(region);

  return (
    <DataList data={[
      regionData && regionData[currentRegion] ? { label: translations['priceGuide.rrp'], value: <FormatNumber value={regionData[currentRegion].price / 100} options={{ style: 'currency', currency, currencyDisplay: 'narrowSymbol' }}/>, key: 'rrp' } : false,
      regionData && regionData[currentRegion] && regionData[currentRegion].price >= 0 && data.details?.attributes ? { label: translations['priceGuide.ppp'], value: <FormatNumber value={regionData[currentRegion].price / (data.details?.attributes.find((attr) => attr.type === 'pieceCount')?.value as number)} options={{ style: 'currency', maximumFractionDigits: 3, currency, currencyDisplay: 'narrowSymbol' }}/>, key: 'ppp' } : false,
      // regionData && regionData[currentRegion] ? { label: translations['regionInfo.points'], value: <FormatNumber value={regionData[currentRegion].points}/>, key: 'points' } : false,
      // rrp && rrp >= 0 ? { label: translations['priceGuide.rrp'], value: <FormatNumber value={rrp} options={{ style: 'currency', currency, currencyDisplay: 'narrowSymbol' }}/>, key: 'rrp' } : false,
      // rrp && rrp > 0 && data.details?.attributes ? { label: translations['priceGuide.ppp'], value: <FormatNumber value={rrp / (data.details.attributes.find((attr) => attr.type === 'pieceCount')?.value as number)} options={{ style: 'currency', maximumFractionDigits: 3, currency, currencyDisplay: 'narrowSymbol' }}/>, key: 'ppp' } : false,
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
