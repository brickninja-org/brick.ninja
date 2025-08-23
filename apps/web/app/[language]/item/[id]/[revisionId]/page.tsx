import type { PageProps } from '@/lib/next';

import { notFound } from 'next/navigation';

import { createMetadata } from '@/lib/metadata';
import { getLanguage } from '@/lib/translate';
import { ItemPageComponent } from '../Component';
import { getRevision } from '../data';

type ItemRevisionPageProps = PageProps<{ id: string, revisionId: string }>;

export default async function ItemRevisionPage({ params }: ItemRevisionPageProps) {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const itemId = Number(id);

  return <ItemPageComponent language={language} itemId={itemId} revisionId={revisionId}/>;
}

export const generateMetadata = createMetadata<ItemRevisionPageProps>(async ({ params }) => {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const itemId = Number(id);
  const { data } = await getRevision(itemId, language, revisionId);

  if(!data) {
    notFound();
  }

  return {
    title: `${data.name || id} @ ${revisionId}`,
    robots: { index: false },
  };
});
