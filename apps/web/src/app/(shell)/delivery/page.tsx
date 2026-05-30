import type { Metadata } from 'next';
import { Truck, Clock, MapPin, Package, CheckCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@mcduffcare/ui/components/ui/card';
import { Badge } from '@mcduffcare/ui/components/ui/badge';

export const metadata: Metadata = {
  title: 'Delivery Information – Nairobi & Kenya',
  description: 'McDuffCare delivery options, costs, areas, and timelines. Same-day delivery in Nairobi, next-day nationwide.',
  alternates: { canonical: '/delivery' },
};

const DELIVERY_OPTIONS = [
  {
    Icon: Truck,
    title: 'Same-Day Delivery',
    subtitle: 'Nairobi only',
    price: 'KES 500',
    time: '2–4 hours',
    details: [
      'Available Monday to Saturday',
      'Order before 2:00 PM for same-day delivery',
      'Covers all Nairobi sub-counties',
      'SMS confirmation + real-time tracking',
    ],
    badge: 'Popular',
    color: 'border-primary',
  },
  {
    Icon: Package,
    title: 'Standard Delivery',
    subtitle: 'Nationwide Kenya',
    price: 'KES 250',
    time: '2–4 business days',
    details: [
      'Available across all 47 counties',
      'Free on orders above KES 2,000',
      'Partnered with G4S & Sendy',
      'Tracking number provided',
    ],
    badge: 'Free above KES 2,000',
    color: 'border-emerald-400',
  },
  {
    Icon: Clock,
    title: 'Express Delivery',
    subtitle: 'Nairobi CBD & Westlands',
    price: 'KES 300',
    time: '1–2 hours',
    details: [
      'Available 9 AM – 6 PM weekdays',
      'Limited to Nairobi CBD and Westlands',
      'Ideal for urgent medicine needs',
      'Dedicated dispatch rider',
    ],
    badge: 'Fastest',
    color: 'border-amber-400',
  },
];

const COVERED_AREAS = [
  'Nairobi CBD', 'Westlands', 'Kilimani', 'Lavington', 'Karen', 'Lang\'ata',
  'South B & C', 'Eastleigh', 'Umoja', 'Embakasi', 'Ruaka', 'Kiambu Town',
  'Thika', 'Machakos', 'Kisumu', 'Mombasa', 'Nakuru', 'Eldoret', 'Nyeri',
  'Meru', 'Kisii', 'Kakamega', 'Garissa', 'Malindi', '...and more',
];

export default function DeliveryPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-3xl font-bold lg:text-4xl">Delivery Information</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            We deliver genuine medicines and health products safely and quickly across Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-16">
          {DELIVERY_OPTIONS.map(({ Icon, title, subtitle, price, time, details, badge, color }) => (
            <Card key={title} className={`border-2 ${color}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">{badge}</Badge>
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="font-heading font-bold text-primary">{price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated time</span>
                  <span className="font-medium">{time}</span>
                </div>
                <ul className="space-y-1.5 pt-2 border-t">
                  {details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Coverage Areas
          </h2>
          <div className="flex flex-wrap gap-2">
            {COVERED_AREAS.map((area) => (
              <Badge key={area} variant="secondary" className="text-sm">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        <Card className="bg-brand-light-blue border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-heading font-semibold mb-3">Important Notes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Prescription orders require pharmacist verification before dispatch — allow extra 1–2 hours.</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Temperature-sensitive medicines (insulin, certain eye drops) are delivered in cold-chain packaging.</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Deliveries require a valid phone number for the dispatch rider to contact you.</li>
              <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" /> For controlled substances, an ID may be required upon delivery.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
