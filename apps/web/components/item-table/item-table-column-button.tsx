import 'server-only';

import type { FC } from 'react';

import { translateMany } from '@/lib/translate';

import { ItemTableColumnsButton as ClientComponent } from './item-table-column-button.client';

export const ItemTableColumnsButton: FC = () => {
  const translations = translateMany(['table.columns', 'table.columns.reset']);

  return <ClientComponent translations={translations}/>;
};
