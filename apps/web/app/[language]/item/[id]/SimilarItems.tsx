import type { Item } from '@brickninja-org/database';

import { Headline } from '@brickninja-org/ui/components/headline/Headline';

import { db } from '@/lib/prisma';
import { ItemTable } from '@/components/item-table/ItemTable';
import { ItemTableContext } from '@/components/item-table/ItemTable.context';
import { ItemTableColumnsButton } from '@/components/item-table/ItemTableColumnsButton';

export async function SimilarItems({ item }: { item: Item }) {
  const query = {
    where: {
      id: { not: item.id },
      OR: [
        { name_de: item.name_de },
        { name_en: item.name_en },
        { name_es: item.name_es },
        { name_fr: item.name_fr },
        { name_nl: item.name_nl },
        // { iconId: item.iconId },
        {
          type: item.type,
          subtype: item.subtype,
        },
      ],
      NOT: {
        name_en: { endsWith: 'V39' },
      },
    }
  };

  const count = await db.item.count(query);

  if (count === 0) {
    return null;
  }

  return (
    <ItemTableContext id="similarItems">
      <Headline id="similar" actions={<ItemTableColumnsButton/>}>Similar Items</Headline>
      <ItemTable query={query} collapsed/>
    </ItemTableContext>
  );
}
