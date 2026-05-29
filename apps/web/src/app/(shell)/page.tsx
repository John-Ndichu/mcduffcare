import type { Metadata } from 'next';

import { HeroSection } from '@/components/sections/hero-section';
import { CategoryGrid } from '@/components/sections/category-grid';
import { FeaturedProducts } from '@/components/sections/featured-products';
import { PromoSection } from '@/components/sections/promo-section';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { NewsletterSection } from '@/components/sections/newsletter-section';

export const metadata: Metadata = {
  title: 'Online Pharmacy Kenya – Medicines, Health & Wellness',
  description:
    "McDuffCare – Kenya's most trusted online pharmacy. Order prescription and OTC medicines, vitamins & supplements. Fast delivery across Nairobi and all of Kenya.",
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoSection />
      <WhyChooseUs />
      <NewsletterSection />
    </>
  );
}
