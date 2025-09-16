import type { FC, ReactNode } from 'react';
import type { Product } from '@brickninja-org/database';
import type { LocalizedEntity } from '@/lib/localized-name';
import type { SubType, Type } from '@/components/item/ItemType.types';
import type { TypeTranslation } from '@/components/item/ItemType.translations';

import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { Button, LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';
import { Icon } from '@brickninja-org/ui/icons';

import { getLanguage, translateMany } from '@/lib/translate';
import { Translate } from '@/components/i18n/Translate';
import { ItemType } from '@/components/item/ItemType';
import { translations as itemTypeTranslations } from '@/components/item/ItemType.translations';
import { ColumnSelect } from '@/components/table/ColumnSelect';
import { ProductLink } from './ProductLink';
import { FormatNumber } from '../format/FormatNumber';

export interface ProductTableProps {
  products: Pick<Product, 'id' | 'type' | 'subtype' | 'pieceCount' | 'figureCount' | keyof LocalizedEntity>[],
  headline?: ReactNode,
  headlineId?: string,
  children?: (table: ReactNode, columnSelect: ReactNode) => ReactNode,
}

export const ProductTable: FC<ProductTableProps> = async ({ products, headline, headlineId, children }) => {
  const language = await getLanguage();
  const Products = createDataTable(products, ({ id }) => id);

  const table = (
    <Products.Table>
      <Products.Column id="id" title={<Translate id="itemTable.column.id"/>} align="end" small sortBy="id">{({ id }) => id}</Products.Column>
      <Products.Column id="product" title="Product">{(product) => <ProductLink product={product}/>}</Products.Column>
      <Products.Column id="type" title={<Translate id="itemTable.column.type"/>} sortBy="type">{(product) => <ItemType display="long" type={product.type as Type} subtype={product.subtype as SubType<Type>} translations={translateMany(itemTypeTranslations.long, language) as unknown as Record<TypeTranslation<Type, SubType<Type>>, string>}/>}</Products.Column>
      <Products.Column id="pieces" title={<Translate id="itemTable.column.pieceCount"/>} align="end" small sortBy="pieceCount">{(product) => <FormatNumber value={product.pieceCount} variant="tabular-nums"/>}</Products.Column>
      <Products.Column id="figures" title={<Translate id="itemTable.column.figureCount"/>} align="end" small sortBy="figureCount">{(product) => <FormatNumber value={product.figureCount ?? 0} variant="tabular-nums"/>}</Products.Column>
      <Products.Column id="actions" title="" small fixed>
        {({ id }) => (
          <Dropdown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right-start">
            <MenuList>
              <LinkButton appearance="menu" icon="eye" href={`/product/${id}`}>View Product</LinkButton>
            </MenuList>
          </Dropdown>
        )}
      </Products.Column>
    </Products.Table>
  );

  const columnSelect = (<ColumnSelect table={Products}/>);

  if (children) {
    return children(table, columnSelect);
  }

  return (
    <>
      {headline && headlineId && (<Headline id={headlineId} actions={columnSelect}>{headline}</Headline>)}
      {table}
    </>
  );
};
