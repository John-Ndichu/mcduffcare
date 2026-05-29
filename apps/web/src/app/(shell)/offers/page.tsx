import type { Metadata } from 'next';

import { OffersPageClient } from './offers-page-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Special Offers & Deals – Up to 40% Off',
  description: 'Shop exclusive deals and discounts on medicines, vitamins, supplements and health products at McDuffCare Kenya. New offers every week.',
  alternates: { canonical: '/offers' },
  openGraph: {
    title: 'Special Offers | McDuffCare Online Pharmacy Kenya',
    description: 'Shop exclusive weekly deals on medicines and health products.',
  },
};

export default function OffersPage() {
  return <OffersPageClient />;
}
