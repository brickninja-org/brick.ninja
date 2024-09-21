import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import type { PageProps } from '@/lib/next';
import { getAlternateUrls } from '@/lib/url';

import { getRevision } from './data';
import { ItemPageComponent } from './component';

export type ItemPageProps = PageProps<{ id: string }>;

export default function ItemPage({ params: { language, id }}: ItemPageProps) {
  const itemId = Number(id);

  return <ItemPageComponent language={language} itemId={itemId}/>;
}

export async function generateMetadata({ params: { language, id }}: ItemPageProps): Promise<Metadata> {
  const itemId = Number(id);
  const { data } = await getRevision(itemId, language);

  if (!data) {
    notFound();
  }

  return {
    title: data.name || id,
    alternates: getAlternateUrls(`/item/${id}`),
  };
}
