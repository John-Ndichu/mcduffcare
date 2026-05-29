import type { Metadata } from 'next';

import { ContactFormClient } from './contact-form-client';

export const metadata: Metadata = {
  title: 'Contact Us – McDuffCare Online Pharmacy Kenya',
  description:
    'Get in touch with McDuffCare Pharmacy. Call, email, or send us a message for order support, prescription queries, or pharmacist consultation.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <ContactFormClient />;
}
