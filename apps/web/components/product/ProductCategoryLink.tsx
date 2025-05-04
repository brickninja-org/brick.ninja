import type { FC } from 'react';
import type { Category, Language } from '@brickninja-org/database';
import type { IconSize } from '@/lib/get-icon-url';
import type { LocalizedEntity } from '@/lib/localized-name';
import type { WithIcon } from '@/lib/with';

import { EntityLink } from '@/components/entity/EntityLink';

export interface ProductCategoryLinkProps {
  productCategory: WithIcon<LocalizedEntity> & Pick<Category, 'id'>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const ProductCategoryLink: FC<ProductCategoryLinkProps> = ({ productCategory, icon = 32, language }) => {
  return <EntityLink href={`/theme/${productCategory.id}`} entity={productCategory} icon={icon} language={language}/>;
};
