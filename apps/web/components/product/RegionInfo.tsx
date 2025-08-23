'use client';

import type { FC } from 'react';
import type { Product, RegionInfo as RegionInfoData } from '@brickninjaapi/types/data/product';
import type { TranslationSubset } from '@/lib/translate';

import { useEffect, useState } from 'react';
import { fetchBrickNinjaApi } from '@brickninjaapi/fetch';

import { useFormatContext } from '@/components/format/Format.context';
import { DataList } from '@/components/info-box/DataList';
import { FormatNumber } from '@/components/format/FormatNumber';
import { FormatDate } from '../format/FormatDate';

interface RegionInfoProps {
  data: Product;
  translations: TranslationSubset<
    | 'regionInfo.rrp'
    | 'regionInfo.ppp'
    | 'regionInfo.points'
    | 'regionInfo.release.date'
    | 'regionInfo.discontinuation.date'
  >;
}

export const RegionInfo: FC<RegionInfoProps> = ({ data, translations }) => {
  const { currency, region } = useFormatContext();
  const [regionData, setRegionData] = useState<RegionInfoData>();

  useEffect(() => {
    fetchBrickNinjaApi(`/v1/products/${data.id}/region-info`, {}).then(setRegionData);
  }, [data, region]);

  const currentRegion = regionData && regionData[getApiRegion(region)];

  return (
    <DataList data={[
      currentRegion && currentRegion.release_date
        ? { label: translations['regionInfo.release.date'], value: <FormatDate date={new Date(currentRegion.release_date)}/>, key: 'release_date' }
        : false,
      currentRegion && currentRegion.discontinuation_date
        ? { label: translations['regionInfo.discontinuation.date'], value: <FormatDate date={new Date(currentRegion.discontinuation_date)} relative/>, key: 'discontinuation_date' }
        : false,
      currentRegion
        ? { label: translations['regionInfo.rrp'], value: <FormatNumber value={currentRegion.price / 100} options={{ style: 'currency', currency, currencyDisplay: 'narrowSymbol' }}/>, key: 'rrp' }
        : false,
      currentRegion && currentRegion.price >= 0 && data.details?.attributes
        ? { label: translations['regionInfo.ppp'], value: <FormatNumber value={(currentRegion.price / 100) / (data.details?.attributes.find((attr) => attr.type === 'pieceCount')?.value as number)} options={{ style: 'currency', maximumFractionDigits: 3, currency, currencyDisplay: 'narrowSymbol' }}/>, key: 'ppp' }
        : false,
      currentRegion && currentRegion.points
        ? { label: translations['regionInfo.points'], value: <FormatNumber value={currentRegion.points}/>, key: 'points' }
        : false,
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
