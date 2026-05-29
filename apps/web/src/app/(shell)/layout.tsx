import * as React from 'react';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';

export default function RootShellLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
    </>
  );
}
