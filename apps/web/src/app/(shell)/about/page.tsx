import type { Metadata } from 'next';
import { ShieldCheck, Truck, HeartHandshake, BadgeCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us – Trusted Online Pharmacy Kenya',
  description:
    'McDuffCare is Kenya\'s most trusted online pharmacy. Licensed by the Pharmacy and Poisons Board, we deliver genuine medicines and health products across Kenya.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="py-12 lg:py-20">
      <section className="container mb-16 text-center">
        <h1 className="font-heading text-3xl font-bold lg:text-5xl text-balance">
          About McDuffCare Pharmacy
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Kenya&apos;s most trusted online pharmacy. We combine cutting-edge technology with
          licensed pharmaceutical expertise to deliver quality medicines and health products
          right to your doorstep — safely, quickly, and affordably.
        </p>
      </section>

      <section className="gradient-brand py-16 text-white mb-16">
        <div className="container grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="font-heading text-3xl font-bold">Our Mission</h2>
            <p className="mt-4 text-white/85 leading-relaxed text-lg">
              To make quality healthcare accessible to every Kenyan by providing genuine medicines,
              expert pharmacist guidance, and fast nationwide delivery — at prices everyone can
              afford.
            </p>
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold">Our Vision</h2>
            <p className="mt-4 text-white/85 leading-relaxed text-lg">
              To be East Africa&apos;s leading digital healthcare platform — bridging the gap
              between patients, pharmacists, and healthcare providers through technology.
            </p>
          </div>
        </div>
      </section>

      <section className="container mb-16">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold lg:text-3xl">
          Why Choose McDuffCare?
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: ShieldCheck, title: 'Genuine Products', desc: 'Every product sourced directly from manufacturers and licensed distributors. PPB certified.' },
            { Icon: Truck, title: 'Fast Delivery', desc: 'Same-day delivery within Nairobi for orders before 2pm. Nationwide next-day service.' },
            { Icon: HeartHandshake, title: 'Expert Pharmacists', desc: 'Free consultations with licensed pharmacists via chat, phone, or in person.' },
            { Icon: BadgeCheck, title: 'PPB Licensed', desc: 'Fully licensed and regulated by the Pharmacy and Poisons Board of Kenya.' },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-white p-6 shadow-card text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="rounded-2xl bg-brand-light-blue border border-primary/20 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Pharmacy & Poisons Board Registration:</strong>{' '}
            PPB/PHARM/XXXXX &nbsp;·&nbsp; All transactions and dispensing are carried out
            by licensed pharmacists in compliance with the Pharmacy and Poisons Act, Cap 244.
          </p>
        </div>
      </section>
    </div>
  );
}
