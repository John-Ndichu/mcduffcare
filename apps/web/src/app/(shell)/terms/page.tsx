import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'McDuffCare Terms of Service – the rules and conditions for using our online pharmacy platform.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="container py-12 lg:py-20 max-w-3xl">
      <h1 className="font-heading text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: January 2025</p>

      <div className="space-y-8">
        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing or using the McDuffCare platform (website, mobile app, or services), you agree to be bound by these Terms of Service and all applicable Kenyan laws and regulations. If you do not agree, do not use our platform.',
          },
          {
            title: '2. Pharmacy Licensing',
            body: 'McDuffCare operates as a licensed online pharmacy under the Pharmacy and Poisons Act, Cap 244 of Kenya. All dispensing activities are conducted by licensed pharmacists. Our PPB license number is PPB/PHARM/XXXXX.',
          },
          {
            title: '3. Prescription Medicines',
            body: 'Prescription-only medicines (POM) will only be dispensed upon receipt of a valid, unexpired prescription from a licensed Kenyan medical practitioner. Submitting a fraudulent prescription is a criminal offence under Kenyan law.',
          },
          {
            title: '4. Product Information',
            body: 'Product descriptions, images, and pricing are provided for informational purposes. Always consult a qualified healthcare professional before starting any new medication. McDuffCare is not liable for misuse of medicines or failure to follow professional medical advice.',
          },
          {
            title: '5. Orders and Payment',
            body: 'By placing an order, you confirm you are at least 18 years of age and the information provided is accurate. We reserve the right to cancel orders at our discretion. Prices are in Kenya Shillings (KES) and include 16% VAT.',
          },
          {
            title: '6. Delivery',
            body: 'Delivery timelines are estimates and not guaranteed. Risk of loss passes to you upon delivery. For damaged or missing items, contact us within 24 hours of the delivery date.',
          },
          {
            title: '7. Returns',
            body: 'Prescription medicines, opened products, temperature-sensitive items, and personal care products cannot be returned. Unopened OTC products in original packaging may be returned within 7 days. Refunds are processed within 5 business days.',
          },
          {
            title: '8. Limitation of Liability',
            body: 'To the maximum extent permitted by Kenyan law, McDuffCare shall not be liable for indirect, incidental, or consequential damages arising from the use of our platform or products.',
          },
          {
            title: '9. Governing Law',
            body: 'These Terms are governed by the laws of Kenya. Any disputes shall be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya.',
          },
          {
            title: '10. Contact',
            body: 'For questions about these Terms, contact us at legal@mcduffcare.co.ke.',
          },
        ].map(({ title, body }) => (
          <div key={title}>
            <h2 className="font-heading text-lg font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
