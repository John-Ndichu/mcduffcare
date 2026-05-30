import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

import { Separator } from '@mcduffcare/ui/components/ui/separator';

const footerLinks = {
  shop: {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/shop/products' },
      { label: 'Prescription Drugs', href: '/shop/products?type=rx' },
      { label: 'OTC Medicine', href: '/shop/products?type=otc' },
      { label: 'Vitamins & Supplements', href: '/shop/products?category=supplements' },
      { label: 'Health Devices', href: '/shop/products?category=devices' },
      { label: 'Special Offers', href: '/offers' },
    ],
  },
  account: {
    title: 'My Account',
    links: [
      { label: 'Login / Register', href: '/auth/login' },
      { label: 'My Orders', href: '/account/orders' },
      { label: 'Wishlist', href: '/account/wishlist' },
      { label: 'My Addresses', href: '/account/addresses' },
      { label: 'Prescription Upload', href: '/prescriptions' },
    ],
  },
  help: {
    title: 'Help & Information',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Delivery Information', href: '/delivery' },
      { label: 'Returns Policy', href: '/returns' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
} as const;

const socialLinks = [
  { Icon: Facebook, href: 'https://facebook.com/mcduffcare', label: 'Facebook' },
  { Icon: Twitter, href: 'https://twitter.com/mcduffcare', label: 'Twitter' },
  { Icon: Instagram, href: 'https://instagram.com/mcduffcare', label: 'Instagram' },
  { Icon: Youtube, href: 'https://youtube.com/mcduffcare', label: 'YouTube' },
] as const;

export function Footer(): React.JSX.Element {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/logo-white.svg"
                alt="McDuffCare Pharmacy"
                width={160}
                height={40}
                className="object-contain"
              />
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-xs">
              Kenya&apos;s trusted online pharmacy delivering quality medicines and health
              products to your doorstep. Licensed by the Pharmacy and Poisons Board of Kenya.
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/70">
              <a
                href="tel:+254700000000"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0 text-brand-sky" />
                +254 700 000 000
              </a>
              <a
                href="mailto:info@mcduffcare.co.ke"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0 text-brand-sky" />
                info@mcduffcare.co.ke
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-brand-sky" />
                <span>Nairobi, Kenya</span>
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-brand-royal transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <p className="text-sm text-white/60">We accept:</p>
          <div className="flex flex-wrap items-center gap-2">
            {['M-Pesa', 'Visa', 'Mastercard', 'Cash on Delivery'].map((method) => (
              <span
                key={method}
                className="rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-white"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Separator className="border-white/10 bg-white/10" />

      <div className="container flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row">
        <p className="text-xs text-white/50">
          &copy; {new Date().getFullYear()} McDuffCare Pharmacy Ltd. All rights reserved.
          Licensed by the Pharmacy &amp; Poisons Board of Kenya.
        </p>
        <p className="text-xs text-white/40">
          Registration No. PPB/PHARM/XXXXX
        </p>
      </div>
    </footer>
  );
}
