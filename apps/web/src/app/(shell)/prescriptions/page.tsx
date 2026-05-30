import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Upload, CheckCircle, Clock, FileText } from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Card, CardContent } from '@mcduffcare/ui/components/ui/card';

export const metadata: Metadata = {
  title: 'Upload Prescription – Order Rx Medicines Online Kenya',
  description: 'Upload your prescription at McDuffCare to order prescription-only medicines online. Verified by licensed pharmacists within 2 hours.',
  alternates: { canonical: '/prescriptions' },
};

const STEPS = [
  { Icon: FileText, title: 'Get your prescription', desc: 'Obtain a valid prescription from a registered Kenyan doctor (KMPDC licensed). Ensure it includes your name, medicine, dosage, and doctor\'s stamp.' },
  { Icon: Upload, title: 'Upload securely', desc: 'Upload a clear photo or PDF of your prescription through your account. All uploads are encrypted and HIPAA-compliant.' },
  { Icon: Clock, title: 'Pharmacist review', desc: 'Our licensed pharmacists review your prescription within 2 business hours and verify it against our database.' },
  { Icon: CheckCircle, title: 'Order fulfilled', desc: 'Once approved, your order is prepared and dispatched. You\'ll receive an SMS confirmation at each step.' },
];

export default function PrescriptionsPublicPage() {
  return (
    <div className="py-12 lg:py-20">
      <section className="gradient-brand py-16 text-white mb-16">
        <div className="container text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold lg:text-5xl">
            Upload Your Prescription
          </h1>
          <p className="mt-4 text-white/80 max-w-xl mx-auto text-lg leading-relaxed">
            Order prescription-only medicines safely and conveniently. Verified by our licensed
            pharmacists — all from the comfort of your home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-brand-royal hover:bg-white/90">
              <Link href="/auth/login?redirect=/shop/account/prescriptions">
                Sign In to Upload
              </Link>
            </Button>
            <Button asChild size="lg" variant="brand-outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
              <Link href="/auth/register">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mb-16">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold lg:text-3xl">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ Icon, title, desc }, idx) => (
            <div key={title} className="relative">
              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-border lg:block" aria-hidden="true" />
              )}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white border-2 border-primary shadow-brand mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white font-heading">
                  {idx + 1}
                </span>
                <h3 className="font-heading font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mb-16">
        <Card className="bg-brand-light-blue border-primary/20">
          <CardContent className="p-8">
            <h3 className="font-heading text-xl font-bold mb-4">Prescription Requirements</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
              {[
                'Must be from a KMPDC-registered doctor',
                'Must include patient\'s full name and date of birth',
                'Must specify medicine name, strength, and quantity',
                'Must include doctor\'s name, registration number, and signature/stamp',
                'Must not be older than 6 months (or as specified)',
                'File must be clear, legible — JPG, PNG, or PDF',
              ].map((req) => (
                <div key={req} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{req}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container text-center">
        <h2 className="font-heading text-2xl font-bold mb-2">Ready to order?</h2>
        <p className="text-muted-foreground mb-6">
          Create a free account or sign in to upload your prescription.
        </p>
        <Button asChild size="lg">
          <Link href="/auth/register">Create Free Account</Link>
        </Button>
      </section>
    </div>
  );
}
