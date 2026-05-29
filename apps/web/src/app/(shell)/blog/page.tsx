import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Card, CardContent, CardHeader } from '@mcduffcare/ui/components/ui/card';

export const metadata: Metadata = {
  title: 'Health Blog – Pharmacy Tips & Wellness Advice',
  description: 'Expert health tips, medicine guides, wellness advice, and pharmacy news from McDuffCare Kenya\'s licensed pharmacists.',
  alternates: { canonical: '/blog' },
};

const SAMPLE_POSTS = [
  {
    slug: 'understanding-your-prescription',
    title: 'Understanding Your Prescription: A Complete Guide',
    excerpt: 'Learn how to read your doctor\'s prescription, understand abbreviations, and ensure you\'re taking the right medication at the right dose.',
    category: 'Medicine Guide',
    date: '2025-01-15',
    readTime: '5 min',
  },
  {
    slug: 'vitamins-for-kenyan-diet',
    title: 'Essential Vitamins for the Kenyan Diet',
    excerpt: 'Find out which vitamins are commonly deficient in Kenya and how to address them through diet and supplementation.',
    category: 'Nutrition',
    date: '2025-01-10',
    readTime: '7 min',
  },
  {
    slug: 'managing-diabetes-kenya',
    title: 'Managing Diabetes in Kenya: Tips from a Pharmacist',
    excerpt: 'Practical advice for Kenyans living with diabetes — from monitoring blood sugar to managing medication and lifestyle changes.',
    category: 'Chronic Conditions',
    date: '2025-01-05',
    readTime: '8 min',
  },
  {
    slug: 'mpesa-pharmacy-safety',
    title: 'How to Buy Medicines Online Safely in Kenya',
    excerpt: 'A guide to identifying genuine online pharmacies, avoiding counterfeit medicines, and staying safe when ordering online.',
    category: 'Patient Safety',
    date: '2024-12-28',
    readTime: '6 min',
  },
];

export default function BlogPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="container">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="font-heading text-3xl font-bold lg:text-4xl">Health Blog</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Expert advice, medicine guides, and wellness tips from our licensed pharmacist team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SAMPLE_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className="h-full transition-all hover:shadow-card-hover hover:-translate-y-0.5">
                <div className="h-40 rounded-t-xl bg-gradient-to-br from-brand-light-blue to-white flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-primary/40" />
                </div>
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{post.readTime} read</span>
                  </div>
                  <h2 className="font-heading font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </CardHeader>
                <CardContent className="pb-5">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
