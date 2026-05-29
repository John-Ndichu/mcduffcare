import type { Metadata } from 'next';

import { OrderDetailClient } from './order-detail-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Order Details',
  robots: { index: false, follow: false },
};

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}
