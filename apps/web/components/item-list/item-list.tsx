'use client';

import type { FC, ReactNode } from 'react';
import type { ItemListVariants } from './item-list.styles';
import type { RefProp } from '@brickninja-org/ui/lib/react';

import { createContext, useMemo } from 'react';

import { itemListVariants } from './item-list.styles';

const ItemListContext = createContext<{ slots?: ReturnType<typeof itemListVariants> }>({});

interface ItemListProps extends ItemListVariants, RefProp<HTMLUListElement> {
  children: ReactNode,
  className?: string,
}

const ItemList: FC<ItemListProps> = ({ ref, children, className, singleColumn }) => {
  const slots = useMemo(() => itemListVariants({ singleColumn }), [singleColumn]);

  return (
    <ItemListContext.Provider value={{ slots }}>
      <ul ref={ref} className={slots.base({ singleColumn, className })}>
        {children}
      </ul>
    </ItemListContext.Provider>
  );
};

ItemList.displayName = 'BrickCatalogUI.ItemList';

interface ItemListItemProps {
  children: ReactNode,
  className?: string,
}

const ItemListItem: FC<ItemListItemProps> = ({ children, className }) => {
  return (
    <ItemListContext.Consumer>
      {({ slots }) => (
        <li className={slots?.item({ className })}>
          {children}
        </li>
      )}
    </ItemListContext.Consumer>
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
