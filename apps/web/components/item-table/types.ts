import type { FC } from 'react';
import type { Prisma } from '@brickninja-org/database';
import type { db } from '@/lib/prisma';
import type { TranslationId } from '@/lib/translate';
import type { Signed } from './query';

export type GlobalColumnId = 'id' | 'item' | 'icon' | 'name_de' | 'name_en' | 'name_es' | 'name_fr' | 'name_nl' | 'type' | 'barcode';

export interface ItemTableQuery<Model extends QueryModel = 'item'> {
  model?: Model;
  where: ColumnModelTypes[Model]['where'];
  mapToItem?: ColumnModelTypes[Model]['map'];
  orderBy?: OrderBy<ColumnModelTypes[Model]['orderBy']>;
}

export type QueryModel = keyof ColumnModelTypes;

export type Result<Select extends Prisma.ItemSelect> =
  Awaited<ReturnType<typeof db.item.findFirstOrThrow<{ select: Select }>>>;

export type OrderBy<T = Prisma.ItemOrderByWithRelationInput> = T | T[];

export interface ItemTableColumn<Select extends Prisma.ItemSelect, Translations extends TranslationId> {
  id: GlobalColumnId,
  order?: number,
  select: Select,
  align?: 'end',
  small?: boolean,
  orderBy?: [asc: OrderBy, desc: OrderBy],
  translations?: Translations[]
}

export type ColumnModelTypes = {
  'item': { select: Prisma.ItemSelect, orderBy: Prisma.ItemOrderByWithRelationInput, where: Prisma.ItemWhereInput, map: undefined },
  'content': { select: Prisma.ContentSelect, orderBy: Prisma.ContentOrderByWithRelationInput, where: Prisma.ContentWhereInput, map: 'containerItem' | 'contentItem' },
};

export interface ExtraColumn<Id extends string, Model extends QueryModel, Select extends ColumnModelTypes[Model]['select']> {
  id: Id,
  select: Select,
  title: string;
  order?: number,
  component: FC<{ item: Result<Select & { id: true }> }>
  align?: 'end',
  small?: boolean,
  orderBy?: [asc: OrderBy<ColumnModelTypes[Model]['orderBy']>, desc: OrderBy<ColumnModelTypes[Model]['orderBy']>]
}

export type AvailableColumn<ColumnId extends string, Model extends QueryModel = QueryModel, Select extends ColumnModelTypes[Model]['select'] = ColumnModelTypes[Model]['select']> = {
  id: ColumnId,
  globalColumnId?: Signed<GlobalColumnId>
  title: string,
  select: Signed<Select>,
  orderBy?: [asc: Signed<OrderBy<ColumnModelTypes[Model]['orderBy']>>, desc: Signed<OrderBy<ColumnModelTypes[Model]['orderBy']>>],
  align?: 'end',
  small?: boolean,
  component?: FC<{ item: Result<Select & { id: true }> }>
};

export type AvailableColumns<ColumnId extends string> = Record<ColumnId, AvailableColumn<ColumnId>>;

export type LoadItemsResult = Promise<{
  items: { id: number }[],
  translations: Partial<Record<TranslationId, string>>
}>;
