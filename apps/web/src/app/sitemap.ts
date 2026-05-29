import type { MetadataRoute } from 'next';

const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://www.mcduffcare.co.ke';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/shop/products`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/prescriptions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/offers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/faqs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/delivery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Dynamic product routes – fetched from API at build time
  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  try {
    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8000/api/v1';

    const [productsRes, categoriesRes] = await Promise.allSettled([
      fetch(`${apiUrl}/products?per_page=500&status=active`, {
        next: { revalidate: 3600 },
      }),
      fetch(`${apiUrl}/categories`, {
        next: { revalidate: 86400 },
      }),
    ]);

    if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
      const { data: products } = await productsRes.value.json() as {
        data: Array<{ slug: string; updated_at: string }>;
      };
      productRoutes = products.map((p) => ({
        url: `${SITE_URL}/shop/products/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }

    if (categoriesRes.status === 'fulfilled' && categoriesRes.value.ok) {
      const { data: categories } = await categoriesRes.value.json() as {
        data: Array<{ slug: string }>;
      };
      categoryRoutes = categories.map((c) => ({
        url: `${SITE_URL}/shop/products?category=${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.75,
      }));
    }
  } catch {
    // Build continues even if API is unreachable
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
