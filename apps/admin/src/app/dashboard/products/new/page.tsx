export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

import { ProductFormPage } from '../product-form';

export const metadata: Metadata = { title: 'Add Product' };

export default function NewProductPage() {
  return <ProductFormPage />;
}
