import type { Metadata } from 'next';
import type { PageProps } from '@/lib/next';

import { notFound } from 'next/navigation';

import { getAlternateUrls } from '@/lib/url';
import { getRevision } from './data';
import { ProductPageComponent } from './Component';

export type ProductPageProps = PageProps<{ id: string }>;

export default async function ProductPage({ params }: ProductPageProps) {
  const { id, language } = await params;
  const productId = Number(id);

  return <ProductPageComponent productId={productId} language={language}/>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id, language } = await params;
  const productId = Number(id);
  const { data } = await getRevision(productId, language);

  if (!data) {
    notFound();
  }

  return {
    title: data.name || id,
    alternates: getAlternateUrls(`/product/${id}`, language),
  };
}
