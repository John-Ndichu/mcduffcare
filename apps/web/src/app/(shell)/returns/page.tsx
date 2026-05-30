import type { Metadata } from 'next';
import { CheckCircle, XCircle, RotateCcw, Clock, Phone } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@mcduffcare/ui/components/ui/card';
import { Alert, AlertDescription } from '@mcduffcare/ui/components/ui/alert';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy',
  description: 'McDuffCare returns and refund policy. Learn which products can be returned and how to request a refund.',
  alternates: { canonical: '/returns' },
};

const RETURNABLE = [
  'Sealed, unopened OTC products in original packaging',
  'Devices/equipment that are defective or damaged on arrival',
  'Wrong products delivered (our error)',
  'Products delivered after expiry date',
];

const NON_RETURNABLE = [
  'Prescription (Rx) medicines — once dispensed',
  'Opened or partially used products',
  'Personal care and hygiene products',
  'Temperature-sensitive items (insulin, eye drops, vaccines)',
  'Products without original packaging or labels',
  'Items purchased on final-sale / clearance',
];

export default function ReturnsPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="container max-w-4xl">
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-bold flex items-center gap-3">
            <RotateCcw className="h-8 w-8 text-primary" />
            Returns & Refund Policy
          </h1>
          <p className="mt-2 text-muted-foreground">Last updated: January 2025</p>
        </div>

        <Alert variant="info" className="mb-8">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Returns must be initiated within <strong>7 days</strong> of delivery. Contact our
            support team to begin the return process.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-10">
          <Card className="border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-emerald-700">
                <CheckCircle className="h-5 w-5" /> Eligible for Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {RETURNABLE.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-red-700">
                <XCircle className="h-5 w-5" /> NOT Eligible for Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {NON_RETURNABLE.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 mb-10">
          <h2 className="font-heading text-xl font-bold">Return Process</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { step: '01', title: 'Contact Us', desc: 'Call or email our support team within 7 days of delivery with your order number and reason for return.' },
              { step: '02', title: 'Approval', desc: 'Our team will review your request and send a return authorisation within 24 business hours.' },
              { step: '03', title: 'Refund', desc: 'Once the returned item is received and inspected, your refund will be processed within 3–5 business days.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 rounded-xl border bg-white p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-heading font-bold text-sm">
                  {step}
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-heading font-semibold mb-4">Refund Timeline</h3>
            <div className="space-y-3 text-sm">
              {[
                { method: 'M-Pesa', timeline: '1–3 business days' },
                { method: 'Visa / Mastercard', timeline: '3–7 business days' },
                { method: 'Cash on Delivery (COD)', timeline: '3–5 business days via M-Pesa' },
              ].map(({ method, timeline }) => (
                <div key={method} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="font-medium">{method}</span>
                  <span className="text-muted-foreground">{timeline}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="rounded-2xl bg-brand-light-blue border border-primary/20 p-6 flex flex-col sm:flex-row items-center gap-4">
          <Phone className="h-8 w-8 text-primary shrink-0" />
          <div>
            <p className="font-heading font-semibold">Need help with a return?</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Call us on <a href="tel:+254700000000" className="text-primary hover:underline font-medium">+254 700 000 000</a>{' '}
              or email <a href="mailto:returns@mcduffcare.co.ke" className="text-primary hover:underline font-medium">returns@mcduffcare.co.ke</a>{' '}
              — Mon–Sat, 8am–8pm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
