import 'server-only';

import type { FC } from 'react';
import type { Language } from '@brickninja-org/database';
// import type { GetSets } from '@brickset-api/types/data/get-sets';
import { localizedName, type LocalizedEntity } from '@/lib/localized-name';

import { parseIcon } from '@/lib/parse-icon';
import { ClientItemTooltip } from '@/components/item/ItemTooltip.client';
import { getTranslate, type TranslationId } from '@/lib/translate';
import type { Item } from '@brickninjaapi/types/data/item';
// import { isTruthy } from '@brickninja-org/helper/is';
import { db } from '@/lib/prisma';

export interface ItemTooltipProps {
  item: Item;
  language: Language;
  hideTitle?: boolean;
}

export const ItemTooltip: FC<ItemTooltipProps> = async ({ item, language, hideTitle }) => {
  const tooltip = await createTooltip(item, language);

  return (
    <ClientItemTooltip tooltip={tooltip} hideTitle={hideTitle}/>
  );
};

export async function createTooltip(item: Item, language: Language) {
  const t = await getTranslate(language);

  // get element color
  const elementColor = item.type === 'Element' && item.details?.color_id
    ? await db.color.findUnique({ where: { id: item.details.color_id }})
    : undefined; 

  /*
  type CurrentRevision = { [key in `current_${typeof language}`]: Revision };
  const selectCurrentRevision = {
    current_en: language === 'en' ? { select: { data: true }} : undefined,
    current_nl: language === 'nl' ? { select: { data: true }} : undefined,
  };
  */

  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  // const isNew = item.LEGOCom.US.dateFirstAvailable ? new Date(item.LEGOCom.US.dateFirstAvailable).valueOf() > monthAgo.valueOf() : false;

  // get item icon
  const icon = parseIcon(item.icon);

  return {
    language,
    name: item.name || '???',
    icon,
    type: item.details?.type ? t(`item.type.short.${item.type}.${item.details.type}` as TranslationId) : t(`item.type.${item.type}`),
    category: item.details?.category_id ? item.details.category_id : undefined,
    elementId: item.details?.design_id ? `${item.id.toString()}/${item.details.design_id.toString()}` : undefined,
    color: elementColor ? { id: elementColor.id, name: localizedName(elementColor, language), colors: { plastic: elementColor.plastic_code }} : undefined,
    /*
    flags: [
      item.flags.includes('NoInstructions') && t('item.flag.NoInstructions'),
    ].filter(isTruthy),
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
    */
  };
}

export type ItemWithAttributes = LocalizedEntity & {
  id: number;
  /*
  number: string;
  version: string;
  theme: string;
  releaseYear: number;
  availability: string;
  pieces: number;
  minifigures: number;
  ages: number;
  dimensions: { height?: number; width?: number; depth?: number, weight?: number };
  */
  // attributes?: { label: string, value: number }[];
  // buff?: string;
};

export interface ItemTooltip {
  language: Language;
  name: string;
  icon?: { id: number; signature: string; extension: string; };
  type?: string;
  category?: number;
  elementId?: string;
  color?: { id: number; name: string; colors: { plastic: string }};
  // flags: string[];
  /*
  number: string;
  version: string;
  theme: string;
  releaseYear: number;
  availablility: string;
  pieces: number;
  minifigures: number;
  ages: number;
  dimensions: { height?: number; width?: number; depth?: number, weight?: number };
  */
}
