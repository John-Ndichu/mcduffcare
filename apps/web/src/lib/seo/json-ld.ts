const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://www.mcduffcare.co.ke';

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate BreadcrumbList JSON-LD structured data.
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate FAQPage JSON-LD structured data.
 */
export function buildFaqJsonLd(faqs: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

/**
 * Generate LocalBusiness JSON-LD.
 */
export function buildLocalBusinessJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': ['Pharmacy', 'LocalBusiness'],
    name: 'McDuffCare Pharmacy',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description:
      "Kenya's trusted online pharmacy delivering quality medicines and health products.",
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nairobi CBD',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
    },
    telephone: '+254700000000',
    email: 'info@mcduffcare.co.ke',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '20:00',
      },
    ],
    priceRange: 'KES',
    currenciesAccepted: 'KES',
    paymentAccepted: 'M-Pesa, Visa, Mastercard, Cash',
  };
}
