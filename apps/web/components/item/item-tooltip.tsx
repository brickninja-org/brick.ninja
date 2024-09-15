import 'server-only';

import type { FC } from 'react';

import type { Language } from '@brickninja-org/database';
import type { GetSets } from '@brickset-api/types/data/get-sets';

// import { getLinkProperties, type linkProperties } from '@/lib/link-properties';
import type { LocalizedEntity } from '@/lib/localized-name';
import { ClientItemTooltip } from '@/components/item/item-tooltip.client';

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

export function createTooltip(item: GetSets, language: Language) {
  // const t = await getTranslation(language);

  // type CurrentRevision = { [key in `current_${typeof language}`]: Revision };

  return {
    language,
    name: item.name,
    number: item.number,
    version: item.numberVariant,
    theme: item.theme,
    release: item.year,
    availablility: item.availability,
    pieces: item.pieces,
    minifigures: item.minifigs,
  };
}

export type ItemWithAttributes = LocalizedEntity & {
  id: number;
  number: string;
  version: string;
  theme: string;
  release: number;
  availability: string;
  pieces: number;
  minifigures: number;
  // attributes?: { label: string, value: number }[];
  // buff?: string;
};

export interface ItemTooltip {
  language: Language;
  name: string;
  number: string;
  version: string;
  theme: string;
  release: number;
  availablility: string;
  pieces: number;
  minifigures: number;
}
