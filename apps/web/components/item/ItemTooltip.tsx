import 'server-only';

import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
import type { GetSets } from '@brickset-api/types/data/get-sets';
import type { LocalizedEntity } from '@/lib/localized-name';

import { isTruthy } from '@brickninja-org/helper/is';

// import { getLinkProperties, type linkProperties } from '@/lib/link-properties';
import { ClientItemTooltip } from '@/components/item/ItemTootip.client';
import { getTranslate } from '@/lib/translate';

export interface ItemTooltipProps {
  item: GetSets;
  language: Language;
  hideTitle?: boolean;
}

export const ItemTooltip: FC<ItemTooltipProps> = async ({ item, language, hideTitle }) => {
  const tooltip = await createTooltip(item, language);

  return (
    <ClientItemTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export async function createTooltip(item: GetSets, language: Language) {
  const t = await getTranslate(language);

  /*
  type CurrentRevision = { [key in `current_${typeof language}`]: Revision };
  const selectCurrentRevision = {
    current_en: language === 'en' ? { select: { data: true }} : undefined,
    current_nl: language === 'nl' ? { select: { data: true }} : undefined,
  };
  */

  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const isNew = item.LEGOCom.US.dateFirstAvailable ? new Date(item.LEGOCom.US.dateFirstAvailable).valueOf() > monthAgo.valueOf() : false;

  return {
    language,
    name: item.name || '???',
    number: item.number,
    version: item.numberVariant,
    theme: item.theme,
    flags: [
      isNew && t('item.flag.New'),
      item.themeGroup.includes('Licensed') && t('item.flag.Licensed'),
    ].filter(isTruthy),
    releaseYear: item.year,
    availablility: item.availability,
    pieces: item.pieces,
    minifigures: item.minifigs,
    ages: item.ageRange.min!,
    dimensions: item.dimensions!,
  };
}

export type ItemWithAttributes = LocalizedEntity & {
  id: number;
  number: string;
  version: string;
  theme: string;
  releaseYear: number;
  availability: string;
  pieces: number;
  minifigures: number;
  ages: number;
  dimensions: { height?: number; width?: number; depth?: number, weight?: number };
  // attributes?: { label: string, value: number }[];
  // buff?: string;
};

export interface ItemTooltip {
  language: Language;
  name: string;
  number: string;
  version: string;
  theme: string;
  releaseYear: number;
  availablility: string;
  pieces: number;
  minifigures: number;
  ages: number;
  dimensions: { height?: number; width?: number; depth?: number, weight?: number };
  flags: string[];
}
