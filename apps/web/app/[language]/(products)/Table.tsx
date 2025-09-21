import type { FC } from 'react';
import type { Category, Language, Product } from '@brickninja-org/database';
import type { LocalizedEntity } from '@/lib/localized-name';
import type { WithIcon } from '@/lib/with';

import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { FlexRow } from '@brickninja-org/ui/components/flex-row';
import { LinkButton } from '@brickninja-org/ui/components/form/Button';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';

import { localizedName } from '@/lib/localized-name';
import { Button } from '@/components/button';
import { EntityIcon } from '@/components/entity/EntityIcon';
import { EntityIconMissing } from '@/components/entity/EntityIconMissing';
import { Translate } from '@/components/i18n/Translate';
import { TableFilterRow } from '@/components/table/TableFilter';
import { FormatNumber } from '@/components/format/FormatNumber';

export function createProductTable(products: Pick<WithIcon<Product & { categories: Category[] }>, keyof LocalizedEntity | 'id' | 'type' | 'subtype' | 'icon' | 'pieceCount' | 'figureCount' | 'categories'>[]) {
  return createDataTable(products, ({ id }) => id);
}

interface CatalogProductTableProps {
  language: Language,
  table: ReturnType<typeof createProductTable>,
  filtered?: boolean,
}

export const CatalogProductDataTable: FC<CatalogProductTableProps> = ({ language, table: products, filtered }) => {
  return (
    <products.Table rowFilter={filtered ? TableFilterRow : undefined}>
      <products.Column id="id" title={<Translate id="itemTable.column.id"/>} small align="end">{({ id }) => id}</products.Column>
      <products.Column id="name" title={<Translate id="itemTable.column.name"/>} sortBy={(product) => product[`name_${language}`]}>
        {({ icon, ...product }) => (
          <FlexRow>{icon ? <EntityIcon icon={icon} size={32} type="product"/> : <EntityIconMissing size={32}/>} <span>{product[`name_${language}`]}</span></FlexRow>
        )}
      </products.Column>
      <products.Column id="categories" title={<Translate id="productTable.column.categories"/>}>
        {({ categories }) => categories.map((category) => localizedName(category, language)).join(', ')}
      </products.Column>
      <products.Column id="pieces" title={<Translate id="productTable.column.pieces"/>} align="end" small sortBy="pieceCount">
        {({ pieceCount }) => <FormatNumber value={pieceCount ?? 0}/>}
      </products.Column>
      <products.Column id="figures" title={<Translate id="productTable.column.figures"/>} align="end" small sortBy="figureCount">
        {({ figureCount }) => <FormatNumber value={figureCount ?? 0}/>}
      </products.Column>
      <products.Column id="actions" title="" small fixed>
        {({ id }) => (
          <Dropdown button={<Button isIconOnly icon="ellipsis-vertical" variant="ghost" className="rounded-sm"/>} preferredPlacement="right-start">
            <MenuList>
              <LinkButton appearance="menu" icon="eye" href={`/product/${id}`}>View Product</LinkButton>
            </MenuList>
          </Dropdown>
        )}
      </products.Column>
    </products.Table>
  );
};
