import type { PageProps } from '@/lib/next';

import { notFound } from 'next/navigation';

import { createMetadata } from '@/lib/metadata';
import { getLanguage } from '@/lib/translate';
import { getRevision } from '../data';
import { ProductPageComponent } from '../Component';

export type ProductRevisionPageProps = PageProps<{ id: string; revisionId: string }>;

export default async function ProductRevisionPage({ params }: ProductRevisionPageProps) {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const productId = Number(id);

  return <ProductPageComponent productId={productId} revisionId={revisionId} language={language}/>;
}

export const generateMetadata = createMetadata<ProductRevisionPageProps>(async ({ params }) => {
  const language = await getLanguage();
  const { id, revisionId } = await params;
  const productId = Number(id);
  const { data } = await getRevision(productId, language, revisionId);

  if(!data) {
    notFound();
  }

  return {
    title: `${data.name || id} @ ${revisionId}`,
    robots: { index: false }
  };
});
