import type { Metadata } from 'next';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@mcduffcare/ui/components/ui/accordion';
import { buildFaqJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'FAQs – Frequently Asked Questions',
  description: 'Answers to common questions about ordering medicines online, prescriptions, delivery, payments, and more at McDuffCare Kenya.',
  alternates: { canonical: '/faqs' },
};

const FAQ_SECTIONS = [
  {
    category: 'Ordering & Products',
    faqs: [
      { q: 'How do I place an order?', a: 'Browse our product catalogue, add items to your cart, and proceed to checkout. You can pay via M-Pesa, Visa, Mastercard, or Cash on Delivery.' },
      { q: 'Are all products genuine?', a: 'Yes. Every product on McDuffCare is sourced directly from manufacturers or authorised distributors. We are licensed by the Pharmacy and Poisons Board of Kenya (PPB).' },
      { q: 'Can I order prescription (Rx) medicines?', a: 'Yes. Simply add the Rx product to your cart and upload a valid prescription from a licensed doctor during checkout. Our pharmacists will verify it within 2 hours.' },
      { q: 'How do I know if a product is in stock?', a: 'In-stock products show a quantity counter. Out-of-stock items are marked clearly. You can sign up for restock alerts on any product page.' },
    ],
  },
  {
    category: 'Prescriptions',
    faqs: [
      { q: 'What documents do I need for Rx products?', a: 'A valid, unexpired prescription from a licensed Kenyan doctor (KMPDC registered). The prescription must include your name, the drug name, dosage, and doctor\'s signature/stamp.' },
      { q: 'How long does prescription verification take?', a: 'Our pharmacists review prescriptions within 2 business hours (Mon–Sat, 8am–8pm). You will receive an SMS confirmation once approved.' },
      { q: 'Can I reorder using an old prescription?', a: 'Prescriptions are valid for the period stated by your doctor (typically 6 months). Expired prescriptions are automatically rejected and a new one must be provided.' },
    ],
  },
  {
    category: 'Delivery',
    faqs: [
      { q: 'What are the delivery areas?', a: 'We deliver nationwide across Kenya. Same-day delivery is available within Nairobi for orders placed before 2pm Monday–Saturday.' },
      { q: 'How much does delivery cost?', a: 'Standard delivery is KES 250. Orders above KES 2,000 qualify for free standard delivery. Same-day delivery in Nairobi is KES 500.' },
      { q: 'How can I track my order?', a: 'Once your order is dispatched, you will receive an SMS with a tracking link. You can also track from your account under "My Orders".' },
    ],
  },
  {
    category: 'Payments',
    faqs: [
      { q: 'What payment methods are accepted?', a: 'We accept Lipa na M-Pesa (STK Push), Visa, Mastercard, and Cash on Delivery for eligible areas.' },
      { q: 'Is it safe to pay online?', a: 'Yes. All card transactions are processed through a PCI-DSS compliant gateway with 256-bit SSL encryption. We never store your card details.' },
      { q: 'What happens if my M-Pesa payment fails?', a: 'If the STK Push times out or you cancel it, your order will remain pending for 15 minutes. You can retry from your order page or choose a different payment method.' },
    ],
  },
  {
    category: 'Returns & Refunds',
    faqs: [
      { q: 'Can I return medicines?', a: 'For safety reasons, prescription medicines, opened OTC products, and temperature-sensitive items cannot be returned. Sealed, unopened OTC products can be returned within 7 days.' },
      { q: 'How long do refunds take?', a: 'Approved refunds are processed within 3–5 business days back to your original payment method (M-Pesa or card).' },
    ],
  },
];

export default function FAQsPage() {
  const allFaqs = FAQ_SECTIONS.flatMap((s) => s.faqs.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(allFaqs)) }}
      />
      <div className="py-12 lg:py-20">
        <div className="container max-w-3xl">
          <div className="mb-12 text-center">
            <h1 className="font-heading text-3xl font-bold lg:text-4xl">Frequently Asked Questions</h1>
            <p className="mt-3 text-muted-foreground">
              Everything you need to know about shopping at McDuffCare.
            </p>
          </div>

          <div className="space-y-8">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.category}>
                <h2 className="mb-3 font-heading text-lg font-bold text-primary border-b pb-2">
                  {section.category}
                </h2>
                <Accordion type="multiple" className="space-y-0">
                  {section.faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`${section.category}-${idx}`}>
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-brand-light-blue border border-primary/20 p-8 text-center">
            <p className="font-heading font-semibold">Still have questions?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Our pharmacist team is available Mon–Sat, 8am–8pm.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a href="tel:+254700000000" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
                Call Us
              </a>
              <a href="mailto:info@mcduffcare.co.ke" className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
