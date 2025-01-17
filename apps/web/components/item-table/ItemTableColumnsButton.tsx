import 'server-only';

import type { FC } from 'react';

import { getLanguage, translateMany } from '@/lib/translate';

import { ItemTableColumnsButton as ClientComponent } from './ItemTableColumnsButton.client';

export const ItemTableColumnsButton: FC = async () => {
  const translations = translateMany(['table.columns', 'table.columns.reset'], await getLanguage());

  return <ClientComponent translations={translations}/>;
};
