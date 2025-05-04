import type { FC, ReactNode } from 'react';

import * as base from '@brickninja-org/ui/components/table/TableFilter';
import { Translate } from '../i18n/Translate';
import { getLanguage, translate } from '@/lib/translate';

export type { TableFilterButtonProps, TableFilterDefinition, TableFilterProviderProps, TableFilterSearchIndex, TableSearchInputProps } from '@brickninja-org/ui/components/table/TableFilter';
export { TableFilterRow, createSearchIndex } from '@brickninja-org/ui/components/table/TableFilter';

export const TableFilterButton: FC<Omit<base.TableFilterButtonProps, 'children' | 'all'> & { children?: ReactNode }> = ({ children, ...props }) => {
  const label = children ?? <Translate id="table.filter"/>;
  const all = <Translate id="table.filter.all"/>;

  return <base.TableFilterButton {...props} all={all}>{label}</base.TableFilterButton>;
};

export const TableFilterProvider: FC<Omit<base.TableFilterProviderProps, 'language'>> = async (props) => {
  const language = await getLanguage();

  return <base.TableFilterProvider {...props} language={language}/>;
};

export const TableSearchInput: FC<base.TableSearchInputProps> = async ({ placeholder, ...props }) => {
  const placeholderWithFallback = placeholder ?? translate('search.placeholder', await getLanguage());

  return <base.TableSearchInput {...props} placeholder={placeholderWithFallback}/>;
};
