import type { Metadata } from 'next';
import { Suspense } from 'react';

import { LoginPageClient } from './login-page-client';
import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your McDuffCare account to manage orders, prescriptions and more.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Skeleton className="h-96 w-full max-w-md rounded-2xl" /></div>}>
      <LoginPageClient />
    </Suspense>
  );
}
