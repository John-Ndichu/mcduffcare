import type { Metadata } from 'next';

import { RegisterPageClient } from './register-page-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your free McDuffCare account for fast online pharmacy shopping in Kenya.',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
