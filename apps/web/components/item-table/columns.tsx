import type { ReactNode } from 'react';
import type { SubType, Type } from '@/components/item/ItemType.types';
import type { TypeTranslation } from '@/components/item/ItemType.translations';
import type { ColumnModelTypes, ExtraColumn, GlobalColumnId, ItemTableColumn, QueryModel, Result } from './types';

import { Prisma } from '@brickninja-org/database';
// import { FlexRow } from '@brickninja-org/ui/components/flex-row';
// import { Tip } from '@brickninja-org/ui/components/tip';

import type { TranslationId } from '@/lib/translate';
// import { FormatNumber } from '@/components/format/format-number';
// import { FormatDate } from '@/components/format/format-date';
import { ItemLink } from '@/components/item/ItemLink';
import { ItemType } from '@/components/item/ItemType';
import { translations } from '@/components/item/ItemType.translations';
import { EntityIcon } from '../entity/EntityIcon';

// typehelper
function createColumn<Select extends Prisma.ItemSelect, Translations extends TranslationId = never>(column: ItemTableColumn<Select, Translations>) {
  return column;
}
export function extraColumn<Model extends QueryModel>(column: ExtraColumn<string, Model, ColumnModelTypes[Model]['select']>) {
  return column;
}

export const globalColumnDefinitions = {
  id: createColumn({
    id: 'id',
    order: 10,
    select: {},
    align: 'end',
    small: true,
    orderBy: [{ id: 'asc' }, { id: 'desc' }]
  }),
  item: createColumn({
    id: 'item',
    order: 20,
    select: { name_de: true, name_en: true, name_es: true, name_fr: true, name_nl: true, icon: true },
  }),
  icon: createColumn({
    id: 'icon',
    order: 30,
    select: { icon: true },
  }),
  name_de: createColumn({
    id: 'name_de',
    order: 40,
    select: { name_de: true },
    orderBy: [{ name_de: 'asc' }, { name_de: 'desc' }]
  }),
  name_en: createColumn({
    id: 'name_en',
    order: 50,
    select: { name_en: true },
    orderBy: [{ name_en: 'asc' }, { name_en: 'desc' }]
  }),
  name_es: createColumn({
    id: 'name_es',
    order: 60,
    select: { name_es: true },
    orderBy: [{ name_es: 'asc' }, { name_es: 'desc' }]
  }),
  name_fr: createColumn({
    id: 'name_fr',
    order: 70,
    select: { name_fr: true },
    orderBy: [{ name_fr: 'asc' }, { name_fr: 'desc' }]
  }),
  name_nl: createColumn({
    id: 'name_nl',
    order: 80,
    select: { name_nl: true },
    orderBy: [{ name_nl: 'asc' }, { name_nl: 'desc' }]
  }),
  type: createColumn({
    id: 'type',
    order: 100,
    select: { type: true, subtype: true },
    orderBy: [[{ type: 'asc' }, { subtype: 'asc' }], [{ type: 'desc' }, { subtype: 'desc' }]],
    translations: translations.long
  }),
  barcode: createColumn({
    id: 'barcode',
    order: 105,
    select: { barcode: true },
    orderBy: [{ barcode: 'asc' }, { barcode: 'desc' }],
  }),
};

type ColumnDefinition<Id extends GlobalColumnId> = (typeof globalColumnDefinitions)[Id];
type AvailableTranslations<Id extends GlobalColumnId> = ColumnDefinition<Id> extends ItemTableColumn<Prisma.ItemSelect, infer Translations> ? Translations : never;

type Renderer = {
  [Id in GlobalColumnId]: (item: Result<ColumnDefinition<Id>['select'] & { id: true }>, translations: Record<AvailableTranslations<Id>, string>) => ReactNode;
};

// const empty = (label = '-') => <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>;

export const globalColumnRenderer: Renderer = {
  id: (item) => item.id,
  item: (item) => <ItemLink item={item}/>,
  icon: (item) => item.icon && <EntityIcon size={32} icon={item.icon}/>,
  name_de: (item) => item.name_de,
  name_en: (item) => item.name_en,
  name_es: (item) => item.name_es,
  name_fr: (item) => item.name_fr,
  name_nl: (item) => item.name_nl,
  // level: (item) => item.level,
  // rarity: (item, t) => <Rarity rarity={item.rarity}>{t[`rarity.${item.rarity}`]}</Rarity>,
  type: (item, t) => <ItemType type={item.type as Type} subtype={item.subtype as SubType<Type>} translations={t as Record<TypeTranslation<Type, SubType<Type>>, string>} display="long"/>,
  barcode: (item) => item.barcode,
  // vendorValue: (item, t) => item.vendorValue === null ? empty(t['item.flag.NoSell']) : <Coins value={item.vendorValue}/>,
  // buyPrice: (item) => !item.tpTradeable ? empty() : renderPriceWithOptionalWarning(item.tpCheckedAt, item.buyPrice),
  // buyQuantity: (item) => !item.tpTradeable ? empty() : <FormatNumber value={item.buyQuantity ?? 0}/>,
  // sellPrice: (item) => !item.tpTradeable ? empty() : renderPriceWithOptionalWarning(item.tpCheckedAt, item.sellPrice),
  // sellQuantity: (item) => !item.tpTradeable ? empty() : <FormatNumber value={item.sellQuantity ?? 0}/>,
};

/*
function renderPriceWithOptionalWarning(date: Date | string | null, price: number | null): ReactNode {
  if(price === null) {
    return '-';
  }

  const lastCheckedAt = date ? new Date(date) : undefined;
  const now = new Date();

  // if we don't have a timestamp or the timestamp is more than 12 hours ago show a warning
  if(!lastCheckedAt || (now.valueOf() - lastCheckedAt.valueOf()) > 1000 * 60 * 60 * 12) {
    return (
      <FlexRow inline>
        <Tip tip={<>Last Updated: <FormatDate relative date={lastCheckedAt}/></>}><Icon icon="warning" color="var(--color-text-muted)"/></Tip>
        <Coins value={price}/>
      </FlexRow>
    );
  }

  return <Coins value={price}/>;
}
*/
