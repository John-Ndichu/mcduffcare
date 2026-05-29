'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Phone,
  ChevronDown,
  Heart,
  MapPin,
} from 'lucide-react';

import { Button } from '@mcduffcare/ui/components/ui/button';
import { Badge } from '@mcduffcare/ui/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@mcduffcare/ui/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@mcduffcare/ui/components/ui/dropdown-menu';
import { cn } from '@mcduffcare/ui/lib/utils';

import { useCart } from '@mcduffcare/api-client/hooks/use-cart';
import { useCurrentUser, useLogout } from '@mcduffcare/api-client/hooks/use-auth';
import { useCategories } from '@mcduffcare/api-client/hooks/use-products';

import { SearchBar } from './search-bar';

const topNavLinks = [
  { label: 'Track Order', href: '/account/orders' },
  { label: 'Find a Pharmacy', href: '/locations' },
  { label: 'Contact Us', href: '/contact' },
];

const mainNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop/products' },
  {
    label: 'Categories',
    href: '/shop/products',
    hasDropdown: true,
  },
  { label: 'Prescriptions', href: '/prescriptions' },
  { label: 'Offers', href: '/offers' },
  { label: 'Health Blog', href: '/blog' },
];

export function Header(): React.JSX.Element {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const { data: cart } = useCart();
  const { data: user } = useCurrentUser({ retry: false });
  const { data: categories } = useCategories();
  const { mutate: logout } = useLogout();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart?.items_count ?? 0;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      <div className="gradient-brand text-white">
        <div className="container flex h-9 items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <a
              href="tel:+254700000000"
              className="flex items-center gap-1 hover:text-brand-light-blue transition-colors"
            >
              <Phone className="h-3 w-3" />
              <span>+254 700 000 000</span>
            </a>
            <span className="hidden sm:flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Free delivery on orders over KES 2,000</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-xs">
            {topNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-brand-light-blue transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div
        className={cn(
          'bg-white border-b transition-shadow duration-200',
          isScrolled && 'shadow-md',
        )}
      >
        <div className="container flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="mr-2 flex shrink-0 items-center gap-2">
            <div className="relative h-10 w-32">
              <Image
                src="/logo.svg"
                alt="McDuffCare Pharmacy"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <div className="hidden flex-1 md:flex">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/account/wishlist" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {user !== undefined ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Account menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold font-heading">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={() => logout()}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}

            {/* Cart */}
 <Button variant="ghost" size="icon" className="relative" asChild>
  <Link href="/shop/cart" aria-label={`Cart (${cartCount} items)`}>
    <span className="relative inline-flex">
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-xs tabular-nums"
        >
          {cartCount > 99 ? '99+' : cartCount}
        </Badge>
      )}
    </span>
  </Link>
</Button>

            {/* Mobile hamburger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 px-0">
                <nav className="flex flex-col py-4">
                  {mainNavLinks.map((link) => (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'px-6 py-3 text-sm font-heading font-medium transition-colors hover:bg-accent hover:text-primary',
                        pathname === link.href && 'bg-primary/5 text-primary border-l-2 border-primary',
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* ── Navigation bar ────────────────────────────────────────────────────── */}
      <nav className="hidden bg-white border-b md:block">
        <div className="container flex h-11 items-center gap-1">
          {mainNavLinks.map((link) =>
            link.hasDropdown === true ? (
              <DropdownMenu key={link.label}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      'flex items-center gap-1 px-3 h-full text-sm font-heading font-medium transition-colors hover:text-primary border-b-2 border-transparent',
                      pathname.startsWith(link.href) && 'text-primary border-primary',
                    )}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {categories?.map((cat) => (
                    <DropdownMenuItem key={cat.id} asChild>
                      <Link href={`/shop/products?category=${cat.slug}`}>{cat.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={cn(
                  'flex items-center px-3 h-full text-sm font-heading font-medium transition-colors hover:text-primary border-b-2 border-transparent',
                  pathname === link.href && 'text-primary border-primary',
                )}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      </nav>
    </header>
  );
}
