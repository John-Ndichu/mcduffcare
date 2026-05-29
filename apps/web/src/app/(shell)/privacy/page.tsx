import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'McDuffCare Privacy Policy – how we collect, use and protect your personal data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="container py-12 lg:py-20 max-w-3xl">
      <h1 className="font-heading text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: January 2025</p>

      <div className="prose prose-sm max-w-none text-foreground space-y-8">
        {[
          {
            title: '1. Information We Collect',
            body: 'We collect information you provide directly, such as your name, email address, phone number, delivery address, and payment details when you create an account or place an order. We also collect prescription documents for Rx products. Automatically collected data includes usage data, IP addresses, and cookies.'
          },
          {
            title: '2. How We Use Your Information',
            body: 'We use your information to process orders, verify prescriptions, deliver products, send order updates via SMS/email, improve our services, personalise your experience, and comply with legal and regulatory obligations under Kenyan law including the Kenya Data Protection Act, 2019.'
          },
          {
            title: '3. Data Sharing',
            body: 'We do not sell your personal data. We share data only with: (a) delivery partners to fulfil orders, (b) payment processors to handle transactions, (c) licensed pharmacists who verify prescriptions, (d) regulatory authorities when legally required.'
          },
          {
            title: '4. Prescription Data',
            body: 'Prescription documents are handled with the highest level of confidentiality. They are accessible only to our licensed pharmacists for verification purposes and are stored securely. We comply fully with the Pharmacy and Poisons Act, Cap 244 and the Kenya Data Protection Act.'
          },
          {
            title: '5. Data Security',
            body: 'We use industry-standard SSL/TLS encryption for all data transmissions. Payment data is processed through PCI-DSS compliant gateways. We never store full card numbers. Access to customer data is restricted to authorised personnel only.'
          },
          {
            title: '6. Cookies',
            body: 'We use cookies to maintain your session, remember cart contents, and improve our website performance. You can control cookies through your browser settings. Disabling cookies may affect some website functionality.'
          },
          {
            title: '7. Your Rights',
            body: 'Under the Kenya Data Protection Act, you have the right to access, correct, delete, or port your personal data. To exercise these rights, contact our Data Protection Officer at privacy@mcduffcare.co.ke.'
          },
          {
            title: '8. Contact',
            body: 'For any privacy concerns, contact us at privacy@mcduffcare.co.ke or write to: Data Protection Officer, McDuffCare Pharmacy Ltd, Nairobi, Kenya.'
          },
        ].map(({ title, body }) => (
          <div key={title}>
            <h2 className="font-heading text-lg font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
