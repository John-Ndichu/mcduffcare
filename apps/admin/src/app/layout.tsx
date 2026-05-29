import type { Metadata, Viewport } from 'next';
import { Jost } from 'next/font/google';

import { Providers } from '@/components/layout/providers';
import { Toaster } from '@mcduffcare/ui/components/ui/sonner';
import '@mcduffcare/ui/styles';

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Admin – McDuffCare',
    template: '%s | McDuffCare Admin',
  },
  description: 'McDuffCare Pharmacy administration dashboard.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  themeColor: '#0A1F6B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={jost.variable}>
      <body className="font-body antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
