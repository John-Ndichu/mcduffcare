import type { Metadata } from 'next';

import { ForgotPasswordClient } from './forgot-password-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Forgot Password',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
