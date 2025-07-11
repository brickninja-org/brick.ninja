import type { PageProps } from '@/lib/next';

import { notFound } from 'next/navigation';

import { createMetadata } from '@/lib/metadata';
import { getRevision } from './data';
import { ProductPageComponent } from './Component';

export type ProductPageProps = PageProps<{ id: string }>;

export default async function ProductPage({ params }: ProductPageProps) {
  const { id, language } = await params;
  const productId = Number(id);

  return <ProductPageComponent productId={productId} language={language}/>;
}

export const generateMetadata = createMetadata<ProductPageProps>(async ({ params }) => {
  const { language, id } = await params;
  const productId = Number(id);
  const { data } = await getRevision(productId, language);

  if(!data) {
    notFound();
  }

  return {
    title: data.name || id,
    url: `/product/${id}`,
  };
});
