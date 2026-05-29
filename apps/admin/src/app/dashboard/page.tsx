export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

import { DashboardPageClient } from './dashboard-page-client';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'McDuffCare admin dashboard overview.',
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
