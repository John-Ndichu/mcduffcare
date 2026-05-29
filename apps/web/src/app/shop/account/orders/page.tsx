import type { Metadata } from 'next';

import { OrdersPageClient } from './orders-page-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Orders',
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return <OrdersPageClient />;
}
