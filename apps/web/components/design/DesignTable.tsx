import type { FC, ReactNode } from 'react';
import type { ElementDesign } from '@brickninja-org/database';

import { createDataTable } from '@brickninja-org/ui/components/table/DataTable';
import { Translate } from '../i18n/Translate';
import { ColumnSelect } from '../table/ColumnSelect';
import { Headline } from '@brickninja-org/ui/components/headline/Headline';
import { Dropdown } from '@brickninja-org/ui/components/dropdown/Dropdown';
import { Button, LinkButton } from '@brickninja-org/ui/components/form/Button';
import { Icon } from '@brickninja-org/ui/icons';
import { MenuList } from '@brickninja-org/ui/components/layout/MenuList';
import Link from 'next/link';

export interface DesignTableProps {
  designs: Pick<ElementDesign, 'id' | 'name' | 'type' | 'weight'>[];
  headline?: ReactNode;
  headlineId?: string;
  children?: (table: ReactNode, columnSelect: ReactNode) => ReactNode;
}

export const DesignTable: FC<DesignTableProps> = ({ designs, headline, headlineId, children }) => {
  const Designs = createDataTable(designs, ({ id }) => id);
  const anyDesignHasWeight = designs.some((design) => design.weight !== null);

  const table = (
    <Designs.Table>
      <Designs.Column id="id" title={<Translate id="itemTable.column.id"/>} align="end" small>{({ id }) => id}</Designs.Column>
      <Designs.Column id="design" title="Design">{(design) => <Link href={`/element/design/${design.id}`}>{design.name}</Link>}</Designs.Column>
      <Designs.Column id="type" title={<Translate id="itemTable.column.type"/>} sortBy="type">{(design) => design.type}</Designs.Column>
      <Designs.Column id="weight" title="Weight" hidden={anyDesignHasWeight} sortBy="weight">{({ weight }) => weight ? weight : <span className="text-muted">-</span>}</Designs.Column>
      <Designs.Column id="actions" title="" small fixed>
        {({ id }) => (
          <Dropdown button={<Button iconOnly appearance="menu"><Icon icon="more"/></Button>} preferredPlacement="right-start">
            <MenuList>
              <LinkButton appearance="menu" icon="eye" href={`/element/design/${id}`}>View Design</LinkButton>
            </MenuList>
          </Dropdown>
        )}
      </Designs.Column>
    </Designs.Table>
  );

  const columnSelect = (<ColumnSelect table={Designs}/>);

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
