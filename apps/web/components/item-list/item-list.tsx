'use client';

import type { FC, ReactNode } from 'react';
import type { ItemListVariants } from './item-list.styles';
import type { RefProp } from '@brickninja-org/ui/lib/react';

import { itemListVariants } from './item-list.styles';

interface ItemListProps extends ItemListVariants, RefProp<HTMLUListElement> {
  children: ReactNode,
  className?: string,
}

const ItemList: FC<ItemListProps> = ({ ref, children, className, singleColumn }) => {
  const slots = itemListVariants({ singleColumn });

  return (
    <ul ref={ref} className={slots.base({ singleColumn, className })}>
      {children}
    </ul>
  );
};

ItemList.displayName = 'BrickCatalogUI.ItemList';

interface ItemListItemProps {
  children: ReactNode,
  className?: string,
}

const ItemListItem: FC<ItemListItemProps> = ({ children, className }) => {
  const slots = itemListVariants();

  return (
    <li className={slots?.item({ className })}>
      {children}
    </li>
  );
};

ItemListItem.displayName = 'BrickCatalog.ItemListItem';

const CompoundItemList = Object.assign(ItemList, {
  Item: ItemListItem,
});

export type {
  ItemListProps,
  ItemListItemProps,
};

export default CompoundItemList;
