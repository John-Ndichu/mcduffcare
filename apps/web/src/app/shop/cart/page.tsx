import type { Metadata } from 'next';

import { CartPageClient } from './cart-page-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your cart and proceed to checkout.',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageClient />;
}
