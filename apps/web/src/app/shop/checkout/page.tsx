import type { Metadata } from 'next';

import { CheckoutPageClient } from './checkout-page-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
