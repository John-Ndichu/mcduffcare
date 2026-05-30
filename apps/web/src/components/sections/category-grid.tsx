'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { Skeleton } from '@mcduffcare/ui/components/ui/skeleton';
import { cn } from '@mcduffcare/ui/lib/utils';
import { useCategories } from '@mcduffcare/api-client/hooks/use-products';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Prescription Drugs', slug: 'prescription', emoji: '', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { id: 2, name: 'Vitamins & Supplements', slug: 'supplements', emoji: '', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { id: 3, name: 'Skincare & Beauty', slug: 'skincare', emoji: '', color: 'bg-pink-50 text-pink-700 border-pink-100' },
  { id: 4, name: 'Baby & Mum', slug: 'baby-mum', emoji: '', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  { id: 5, name: 'Health Devices', slug: 'devices', emoji: '', color: 'bg-sky-50 text-sky-700 border-sky-100' },
  { id: 6, name: 'Sexual Health', slug: 'sexual-health', emoji: '', color: 'bg-red-50 text-red-700 border-red-100' },
  { id: 7, name: 'Eye Care', slug: 'eye-care', emoji: '', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { id: 8, name: 'First Aid', slug: 'first-aid', emoji: '', color: 'bg-orange-50 text-orange-700 border-orange-100' },
];

export function CategoryGrid(): React.JSX.Element {
  const { data: categories, isLoading } = useCategories();

  const displayCategories =
    categories !== undefined && categories.length > 0
      ? categories.slice(0, 8)
      : FALLBACK_CATEGORIES;

  return (
    <section className="py-10 lg:py-14" aria-labelledby="categories-heading">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2
              id="categories-heading"
              className="font-heading text-2xl font-bold text-foreground lg:text-3xl"
            >
              Shop by Category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Find exactly what you need
            </p>
          </div>
          <Link
            href="/shop/products"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 lg:gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex flex-col items-center rounded-xl p-4 h-28"
                />
              ))
            : displayCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop/products?category=${cat.slug}`}
                  className={cn(
                    'group flex flex-col items-center rounded-xl border p-4 text-center transition-all duration-200',
                    'hover:shadow-card-hover hover:-translate-y-0.5',
                    'bg-white border-border hover:border-primary/30',
                  )}
                >
                  {'image_url' in cat && cat.image_url !== null && cat.image_url !== undefined ? (
                    <div className="relative mb-3 h-12 w-12 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'mb-3 flex h-12 w-12 items-center justify-center rounded-full border text-2xl',
                        'emoji' in cat ? (cat as typeof FALLBACK_CATEGORIES[0]).color : 'bg-primary/10',
                      )}
                    >
                      {'emoji' in cat ? (cat as typeof FALLBACK_CATEGORIES[0]).emoji : ''}
                    </div>
                  )}
                  <span className="text-xs font-medium font-heading text-foreground leading-tight group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/shop/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            See all categories →
          </Link>
        </div>
      </div>
    </section>
  );
}
