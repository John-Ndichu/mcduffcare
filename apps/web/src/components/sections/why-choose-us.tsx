import * as React from 'react';
import {
  ShieldCheck,
  Truck,
  Clock,
  HeartHandshake,
  BadgeCheck,
  CreditCard,
} from 'lucide-react';

import { cn } from '@mcduffcare/ui/lib/utils';

const features = [
  {
    Icon: ShieldCheck,
    title: '100% Genuine Products',
    description:
      'All medicines sourced directly from manufacturers and authorised distributors. PPB licensed.',
    color: 'text-brand-royal bg-brand-light-blue',
  },
  {
    Icon: Truck,
    title: 'Fast Delivery',
    description:
      'Same-day delivery within Nairobi for orders placed before 2pm. Countrywide next-day shipping.',
    color: 'text-emerald-700 bg-emerald-50',
  },
  {
    Icon: Clock,
    title: '24/7 Support',
    description:
      'Our pharmacist helpline and customer support team are available around the clock.',
    color: 'text-amber-700 bg-amber-50',
  },
  {
    Icon: HeartHandshake,
    title: 'Pharmacist Consultation',
    description:
      'Free consultation with licensed pharmacists via chat, call, or in-person at our branches.',
    color: 'text-purple-700 bg-purple-50',
  },
  {
    Icon: BadgeCheck,
    title: 'PPB Licensed',
    description:
      'Fully licensed by the Pharmacy and Poisons Board of Kenya. Safe, legal, and regulated.',
    color: 'text-brand-royal bg-brand-light-blue',
  },
  {
    Icon: CreditCard,
    title: 'Secure Payments',
    description:
      'M-Pesa, Visa, Mastercard, and Cash on Delivery. All transactions are 256-bit encrypted.',
    color: 'text-rose-700 bg-rose-50',
  },
] as const;

export function WhyChooseUs(): React.JSX.Element {
  return (
    <section className="py-10 lg:py-16" aria-labelledby="why-us-heading">
      <div className="container">
        <div className="mb-10 text-center">
          <h2
            id="why-us-heading"
            className="font-heading text-2xl font-bold text-foreground lg:text-3xl"
          >
            Why Choose McDuffCare?
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            We combine technology, trust, and expertise to deliver the best pharmacy
            experience in Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, description, color }) => (
            <div
              key={title}
              className="group flex gap-4 rounded-xl border bg-white p-6 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
            >
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                  color,
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
