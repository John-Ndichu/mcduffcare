import type { Metadata } from 'next';
import Link from 'next/link';
import { User, ShoppingBag, Heart, MapPin, Settings, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: { default: 'My Account', template: '%s | My Account – McDuffCare' },
  robots: { index: false, follow: false },
};

const accountNav = [
  { label: 'Overview', href: '/shop/account', icon: User },
  { label: 'My Orders', href: '/shop/account/orders', icon: ShoppingBag },
  { label: 'Wishlist', href: '/shop/account/wishlist', icon: Heart },
  { label: 'Addresses', href: '/shop/account/addresses', icon: MapPin },
  { label: 'Prescriptions', href: '/shop/account/prescriptions', icon: FileText },
  { label: 'Profile Settings', href: '/shop/account/profile', icon: Settings },
];

export default function AccountLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="container py-8 lg:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <nav className="rounded-xl border bg-white shadow-card overflow-hidden">
            {accountNav.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 border-b last:border-b-0 px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-primary"
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
