import type { Metadata } from 'next';

import { ProfilePageClient } from './profile-page-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Profile Settings' };

export default function ProfilePage() {
  return <ProfilePageClient />;
}
