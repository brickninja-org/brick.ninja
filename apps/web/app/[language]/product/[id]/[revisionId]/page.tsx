import type { Metadata } from 'next';
import type { PageProps } from '@/lib/next';

import { notFound } from 'next/navigation';

import { getRevision } from '../data';
import { ProductPageComponent } from '../Component';

export type ProductRevisionPageProps = PageProps<{ id: string; revisionId: string }>;

export default async function ProductRevisionPage({ params }: ProductRevisionPageProps) {
  const { id, revisionId, language } = await params;
  const productId = Number(id);

  return <ProductPageComponent productId={productId} revisionId={revisionId} language={language}/>;
}

export async function generateMetadata({ params }: ProductRevisionPageProps): Promise<Metadata> {
  const { id, revisionId, language } = await params;
  const productId = Number(id);
  const { data } = await getRevision(productId, language, revisionId);

  if (!data) {
    notFound();
  }

  return {
    title: `${data.name || id} @${revisionId}`,
    robots: { index: false },
  };
}
