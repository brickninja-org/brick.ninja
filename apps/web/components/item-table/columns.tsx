import type { ReactNode } from 'react';

import { Prisma } from '@brickninja-org/database';
// import { FlexRow } from '@brickninja-org/ui/components/flex-row';
// import { Tip } from '@brickninja-org/ui/components/tip';

import type { TranslationId } from '@/lib/translate';
// import { FormatNumber } from '@/components/format/format-number';
// import { FormatDate } from '@/components/format/format-date';
import { ItemLink } from '@/components/item/item-link';
import type { SubType, Type } from '@/components/item/item-type.types';
import { ItemType } from '@/components/item/item-type';
import { translations, type TypeTranslation } from '@/components/item/item-type.translations';

import type { ColumnModelTypes, ExtraColumn, GlobalColumnId, ItemTableColumn, QueryModel, Result } from './types';

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
    align: 'right',
    small: true,
    orderBy: [{ id: 'asc' }, { id: 'desc' }]
  }),
  productCode: createColumn({
    id: 'productCode',
    order: 20,
    select: { productCode: true },
  }),
  item: createColumn({
    id: 'item',
    order: 30,
    select: { name_en: true, name_nl: true },
  }),
  name_en: createColumn({
    id: 'name_en',
    order: 40,
    select: { name_en: true },
    orderBy: [{ name_en: 'asc' }, { name_en: 'desc' }]
  }),
  name_nl: createColumn({
    id: 'name_nl',
    order: 50,
    select: { name_nl: true },
    orderBy: [{ name_nl: 'asc' }, { name_nl: 'desc' }]
  }),
  type: createColumn({
    id: 'type',
    order: 60,
    select: { type: true, subtype: true },
    orderBy: [[{ type: 'asc' }, { subtype: 'asc' }], [{ type: 'desc' }, { subtype: 'desc' }]],
    translations: translations.long
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
  // icon: (item) => item.icon && <EntityIcon size={32} icon={item.icon}/>,
  name_en: (item) => item.name_en,
  name_nl: (item) => item.name_nl,
  // name_fr: (item) => item.name_fr,
  // level: (item) => item.level,
  // rarity: (item, t) => <Rarity rarity={item.rarity}>{t[`rarity.${item.rarity}`]}</Rarity>,
  type: (item, t) => <ItemType type={item.type as Type} subtype={item.subtype as SubType<Type>} translations={t as Record<TypeTranslation<Type, SubType<Type>>, string>} display="long"/>,
  productCode: (item) => item.productCode,
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
