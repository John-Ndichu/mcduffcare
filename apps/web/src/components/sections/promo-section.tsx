import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Badge } from '@mcduffcare/ui/components/ui/badge';

export function PromoSection(): React.JSX.Element {
  return (
    <section className="py-10 lg:py-14" aria-labelledby="promo-heading">
      <div className="container">
        <h2 id="promo-heading" className="sr-only">Special promotions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl gradient-brand p-8 text-white">
            <div className="relative z-10">
              <Badge className="mb-3 bg-white/20 text-white border-white/30">
                Easy Process
              </Badge>
              <h3 className="font-heading text-2xl font-bold leading-tight">
                Upload Your Prescription
              </h3>
              <p className="mt-2 max-w-xs text-sm text-white/80 leading-relaxed">
                Upload your doctor&apos;s prescription and we&apos;ll prepare your order. Secure,
                fast, and verified by our pharmacists.
              </p>
              <Button
                asChild
                className="mt-6 bg-white text-brand-royal hover:bg-white/90 shadow-none"
              >
                <Link href="/prescriptions">
                  Upload Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div
              className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-110"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-10 right-10 h-32 w-32 rounded-full bg-brand-sky/20 blur-xl"
              aria-hidden="true"
            />
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-brand-navy p-8 text-white">
            <div className="relative z-10">
              <Badge className="mb-3 bg-white/20 text-white border-white/30">
                Convenient Payment
              </Badge>
              <h3 className="font-heading text-2xl font-bold leading-tight">
                Pay with M-Pesa,<br />Anytime
              </h3>
              <p className="mt-2 max-w-xs text-sm text-white/80 leading-relaxed">
                Seamless Lipa na M-Pesa STK Push at checkout. Also accept Visa, Mastercard,
                and Cash on Delivery.
              </p>
              <Button
                asChild
                variant="brand-outline"
                className="mt-6 border-white/40 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/shop/products">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div
              className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-brand-royal/30 blur-2xl transition-transform duration-500 group-hover:scale-110"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
