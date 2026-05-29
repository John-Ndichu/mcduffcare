import type { Metadata, Viewport } from 'next';
import { Jost } from 'next/font/google';
import Script from 'next/script';

import { Providers } from '@/components/layout/providers';
import { Toaster } from '@mcduffcare/ui/components/ui/sonner';
import '@mcduffcare/ui/styles';

// ── Fonts ─────────────────────────────────────────────────────────────────────
const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
  preload: true,
});

// ── Site metadata ─────────────────────────────────────────────────────────────
const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://www.mcduffcare.co.ke';
const SITE_NAME = 'McDuffCare Pharmacy';
const SITE_DESCRIPTION =
  'Kenya\'s trusted online pharmacy. Shop prescription medicines, OTC drugs, health supplements, and wellness products. Fast delivery across Nairobi and Kenya.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Online Pharmacy Kenya`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'online pharmacy Kenya',
    'buy medicine online Nairobi',
    'prescription drugs Kenya',
    'health supplements Kenya',
    'McDuffCare pharmacy',
    'pharmacy delivery Nairobi',
    'OTC medicine Kenya',
    'wellness products Kenya',
  ],
  authors: [{ name: 'McDuffCare', url: SITE_URL }],
  creator: 'McDuffCare',
  publisher: 'McDuffCare Pharmacy Ltd',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Online Pharmacy Kenya`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'McDuffCare Online Pharmacy Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mcduffcare',
    creator: '@mcduffcare',
    title: `${SITE_NAME} | Online Pharmacy Kenya`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-KE': SITE_URL,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#1A3FA8' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
  },
  other: {
    'msapplication-TileColor': '#1A3FA8',
    'theme-color': '#1A3FA8',
  },
};

export const viewport: Viewport = {
  themeColor: '#1A3FA8',
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const GA_ID = process.env['NEXT_PUBLIC_GA_ID'] ?? '';

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={jost.variable}>
      <head>
        {/* Preconnect to external origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href={process.env['NEXT_PUBLIC_API_URL'] ?? ''} />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Structured data: Organisation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Pharmacy',
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              image: `${SITE_URL}/og-image.jpg`,
              description: SITE_DESCRIPTION,
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Nairobi',
                addressLocality: 'Nairobi',
                addressCountry: 'KE',
              },
              telephone: '+254700000000',
              email: 'info@mcduffcare.co.ke',
              openingHours: 'Mo-Sa 08:00-20:00',
              priceRange: 'KES',
              currenciesAccepted: 'KES',
              paymentAccepted: 'M-Pesa, Visa, Mastercard',
              sameAs: [
                'https://www.facebook.com/mcduffcare',
                'https://twitter.com/mcduffcare',
                'https://www.instagram.com/mcduffcare',
              ],
            }),
          }}
        />

        {/* Breadcrumb list structured data (site-wide) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: SITE_URL,
              name: SITE_NAME,
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>

      <body className="font-body antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>

        {/* Google Analytics – load after page interactive */}
        {GA_ID !== '' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: true,
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure',
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
