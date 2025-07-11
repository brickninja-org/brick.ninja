import type { PageProps } from '@/lib/next';

import { notFound } from 'next/navigation';

import { createMetadata } from '@/lib/metadata';
import { getRevision } from './data';
import { ItemPageComponent } from './Component';

export type ItemPageProps = PageProps<{ id: string }>;

export default async function ItemPage({ params }: ItemPageProps) {
  const { language, id } = await params;
  const itemId = Number(id);

  return <ItemPageComponent language={language} itemId={itemId}/>;
}

export const generateMetadata = createMetadata<ItemPageProps>(async ({ params }) => {
  const { language, id } = await params;
  const itemId = Number(id);
  const { data } = await getRevision(itemId, language);

  if(!data) {
    notFound();
  }

  return {
    title: data.name || id,
    url: `/item/${id}`,
  };
});
