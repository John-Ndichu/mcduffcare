import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProductDetailClient } from './product-detail-client';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8000/api/v1';
const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://www.mcduffcare.co.ke';

interface ProductData {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  price: number;
  compare_price: number | null;
  meta_title: string | null;
  meta_description: string | null;
  primary_image: { url: string; alt: string } | null;
  category: { name: string; slug: string };
  brand: { name: string } | null;
  average_rating: number;
  reviews_count: number;
  requires_prescription: boolean;
  stock_quantity: number;
}

async function getProduct(slug: string): Promise<ProductData | null> {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data: ProductData };
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (product === null) return { title: 'Product Not Found' };

  const title = product.meta_title ?? product.name;
  const description =
    product.meta_description ??
    product.short_description ??
    `Buy ${product.name} online in Kenya. ${product.category.name} from McDuffCare Pharmacy.`;

  return {
    title,
    description,
    alternates: { canonical: `/shop/products/${slug}` },
    openGraph: {
      title: `${title} | McDuffCare`,
      description,
      url: `/shop/products/${slug}`,
      type: 'website',
      images:
        product.primary_image !== null
          ? [{ url: product.primary_image.url, alt: product.primary_image.alt, width: 800, height: 800 }]
          : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.primary_image !== null ? [product.primary_image.url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (product === null) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: slug,
    image: product.primary_image?.url,
    brand:
      product.brand !== null
        ? { '@type': 'Brand', name: product.brand.name }
        : undefined,
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/shop/products/${slug}`,
      priceCurrency: 'KES',
      price: product.price,
      availability:
        product.stock_quantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'McDuffCare Pharmacy' },
    },
    ...(product.reviews_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.average_rating,
        reviewCount: product.reviews_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient slug={slug} />
    </>
  );
}
