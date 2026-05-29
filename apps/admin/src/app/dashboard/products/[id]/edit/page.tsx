export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

import { ProductFormPage } from '../../product-form';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: 'Edit Product' };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductFormPage productId={Number(id)} />;
}
