import type { Metadata } from 'next';

import { AccountOverviewClient } from './account-overview-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'My Account' };

export default function AccountPage() {
  return <AccountOverviewClient />;
}
