'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { cn } from '@mcduffcare/ui/lib/utils';

interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  image: string;
  imageAlt: string;
  bgClass: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    badge: 'Trusted Pharmacy',
    title: 'Your Health,\nDelivered Fast',
    subtitle:
      'Shop prescription drugs, vitamins, and wellness products from Kenya\'s most trusted online pharmacy. Fast delivery across Nairobi.',
    cta: { label: 'Shop Now', href: '/shop/products' },
    ctaSecondary: { label: 'Upload Prescription', href: '/prescriptions' },
    image: '/images/hero-slide-1.jpg',
    imageAlt: 'Pharmacist with medicine',
    bgClass: 'gradient-brand',
  },
  {
    id: 2,
    badge: 'Up to 40% Off',
    title: 'Health Deals\nYou Can Trust',
    subtitle:
      'Exclusive discounts on top-brand supplements, skincare, and everyday health essentials. Limited time offers updated weekly.',
    cta: { label: 'View Offers', href: '/offers' },
    image: '/images/hero-slide-2.jpg',
    imageAlt: 'Health products on sale',
    bgClass: 'bg-brand-navy',
  },
  {
    id: 3,
    badge: 'Free Consultation',
    title: 'Talk to a\nPharmacist',
    subtitle:
      'Get professional advice from our licensed pharmacists. Available Mon–Sat, 8am–8pm. Free for all registered customers.',
    cta: { label: 'Book Consultation', href: '/consultation' },
    image: '/images/hero-slide-3.jpg',
    imageAlt: 'Pharmacist consultation',
    bgClass: 'bg-gradient-to-br from-brand-royal to-brand-blue',
  },
];

export function HeroSection(): React.JSX.Element {
  const autoplay = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (emblaApi === undefined) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section
      className="relative overflow-hidden"
      aria-label="Featured promotions"
      aria-roledescription="carousel"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={cn('relative min-w-full', slide.bgClass)}
              aria-roledescription="slide"
              aria-label={slide.title.replace('\n', ' ')}
            >
              <div className="container relative z-10 flex min-h-[420px] items-center py-12 md:min-h-[500px] lg:min-h-[560px]">
                <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2">
                  {/* Text */}
                  <div className="text-white">
                    <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                      {slide.badge}
                    </Badge>
                    <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl xl:text-6xl whitespace-pre-line">
                      {slide.title}
                    </h1>
                    <p className="mt-4 max-w-md text-base text-white/85 leading-relaxed sm:text-lg">
                      {slide.subtitle}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button
                        variant="brand"
                        size="lg"
                        asChild
                        className="bg-white text-brand-royal hover:bg-white/90 shadow-none"
                      >
                        <Link href={slide.cta.href}>
                          {slide.cta.label}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                      {slide.ctaSecondary !== undefined && (
                        <Button
                          variant="brand-outline"
                          size="lg"
                          asChild
                          className="border-white/50 text-white hover:bg-white/10 hover:text-white"
                        >
                          <Link href={slide.ctaSecondary.href}>{slide.ctaSecondary.label}</Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative hidden h-72 lg:block lg:h-96">
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      className="object-contain object-center drop-shadow-2xl"
                      priority={slide.id === 1}
                      sizes="(min-width: 1024px) 50vw, 0px"
                    />
                  </div>
                </div>
              </div>

              {/* Decorative blobs */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next controls */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2" role="tablist" aria-label="Slides">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            role="tab"
            aria-selected={idx === selectedIndex}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={cn(
              'h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              idx === selectedIndex ? 'w-6 bg-white' : 'w-2 bg-white/50',
            )}
          />
        ))}
      </div>
    </section>
  );
}
