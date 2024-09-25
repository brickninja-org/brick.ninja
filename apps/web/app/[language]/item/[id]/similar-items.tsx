import { db } from '@/lib/prisma';
import type { Item } from '@brickninja-org/database';
import { Headline } from '@brickninja-org/ui/components/headline';

import { ItemTable, ItemTableColumnsButton, ItemTableContext } from '@/components/item-table';

export async function SimilarItems({ item }: { item: Item }) {
  const query = {
    where: {
      id: { not: item.id },
      OR: [
        { name_en: item.name_en },
        { name_nl: item.name_nl },
        {
          type: item.type,
          subtype: item.subtype,
        }
      ],
    }
  };

  const count = await db.item.count(query);

  if (count === 0) {
    return null;
  }

  return (
    <ItemTableContext id="similar-items">
      <Headline id="similar" actions={<ItemTableColumnsButton/>}>Similar Items</Headline>
      <ItemTable query={query} collapsed/>
    </ItemTableContext>
  );
}
