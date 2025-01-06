import { type Language } from '@brickninja-org/database';
import { Headline } from '@brickninja-org/ui/components/headline';

import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/link-properties';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/format/format-date';
import { ItemLink } from '@/components/item/item-link';
import { ItemList, ItemListItem } from '@/components/item/item-list';
import { HeroLayout } from '@/components/layout/hero-layout';

const getItems = cache(async (language: Language) => {
  const [recentlyAdded, recentlyUpdated] = await Promise.all([
    db.item.findMany({
      select: { ...linkProperties, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 48,
    }),
    db.revision.findMany({
      where: { entity: 'Item', type: 'Updated', language },
      select: { id: true, createdAt: true, itemHistory: { select: { item: { select: linkProperties }}}},
      orderBy: { createdAt: 'desc' },
      take: 48,
    }),
  ]);

  return { recentlyAdded, recentlyUpdated };
}, ['items'], { revalidate: 60 });

export default async function ItemPage({ params}: PageProps) {
  const { language } = await params;

  const { recentlyAdded, recentlyUpdated } = await getItems(language);

  return (
    <HeroLayout hero={<Headline id="items">Items</Headline>} toc>
      <Headline id="recent">Recently added</Headline>
      <ItemList>
        {recentlyAdded.length > 0 ? recentlyAdded.map((item) => <ItemListItem key={item.id}><ItemLink item={item}/><FormatDate date={item.createdAt} relative/></ItemListItem>) : []}
      </ItemList>

      <Headline id="updated">Recently updated</Headline>
      <ItemList>
        {recentlyUpdated.length > 0 ? recentlyUpdated.map((revision) => <ItemListItem key={revision.id}><ItemLink item={revision.itemHistory!.item}/><FormatDate date={revision.createdAt} relative/></ItemListItem>) : []}
      </ItemList>
    </HeroLayout>
  );
}

export const metadata = {
  title: 'Items',
};
