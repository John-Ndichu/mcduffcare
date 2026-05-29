import type { MetadataRoute } from 'next';

const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://www.mcduffcare.co.ke';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/',
          '/auth/',
          '/api/',
          '/checkout/',
          '/shop/cart',
          '/_next/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
